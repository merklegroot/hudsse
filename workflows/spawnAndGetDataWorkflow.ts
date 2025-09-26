import { spawn, ChildProcess } from 'child_process';
import { SpawnOptions } from '../models/SpawnOptions';
import { SpawnResult } from '../models/SpawnResult';

/** Generic workflow to spawn a new termianl with a command and get its output data */
async function execute(options: SpawnOptions): Promise<SpawnResult> {
  const { command, args, timeout = 10000, dataCallback } = options;
  
  return new Promise((resolve) => {
    const child: ChildProcess = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {  NODE_ENV: 'development' },
      shell: false,
      detached: false
    });
    
    let stdout = '';
    let stderr = '';
    
    // Collect stdout data
    child.stdout?.on('data', (data: Buffer) => {
      stdout += data.toString();
      dataCallback?.(data.toString());
    });
    
    // Collect stderr data
    child.stderr?.on('data', (data: Buffer) => {
      stderr += data.toString();
      dataCallback?.(data.toString());
    });
    
    // Handle process completion
    child.on('close', (code: number | null) => {
      console.log(`Command completed with code: ${code}`);
      resolve({
        wasSuccessful: code === 0,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: code
      });
    });
    
    // Handle process errors
    child.on('error', (error: Error) => {
      console.error('Failed to spawn process:', error);
      resolve({
        wasSuccessful: false,
        stdout: '',
        stderr: error.message,
        exitCode: null
      });
    });
    
    // Set a timeout to prevent hanging
    const timeoutHandle = setTimeout(() => {
      console.log('Process timeout, killing...');
      child.kill('SIGKILL');
      resolve({
        wasSuccessful: false,
        stdout: stdout.trim(),
        stderr: 'Process timed out',
        exitCode: null
      });
    }, timeout);
    
    // Clear timeout when process completes
    child.on('close', () => {
      clearTimeout(timeoutHandle);
    });
  });
}

/** Execute with multiple fallback methods */
async function executeWithFallback(options: SpawnOptions): Promise<SpawnResult> {
  const { command, args, timeout, dataCallback } = options;
  
  const methods = [
    // Method 1: Direct command
    () => execute({ command, args, timeout, dataCallback }),
    
    // Method 2: Use login shell to get fresh user environment (without password)
    () => execute({
      command: 'bash',
      args: ['-l', '-c', `${command} ${args.join(' ')}`],
      timeout,
      dataCallback: dataCallback // Use the data callback for fallback methods
    }),
    
    // Method 3: Use env -i for clean environment  
    () => execute({
      command: 'env',
      args: ['-i', command, ...args],
      timeout,
      dataCallback: dataCallback // Use the data callback for fallback methods
    })
  ];
  
  // Try each method until one succeeds
  for (let i = 0; i < methods.length; i++) {
    try {
      console.log(`Trying spawn method ${i + 1}...`);
      const result = await methods[i]();
      if (result.wasSuccessful && result.stdout.length > 0) {
        console.log(`Spawn method ${i + 1} succeeded`);
        return result;
      } else {
        console.log(`Spawn method ${i + 1} failed or returned empty output`);
      }
    } catch (error) {
      console.log(`Spawn method ${i + 1} threw error:`, error);
    }
  }
  
  // All methods failed
  return {
    wasSuccessful: false,
    stdout: '',
    stderr: 'All spawn methods failed',
    exitCode: null
  };
}

export const spawnAndGetDataWorkflow = {
  execute,
  executeWithFallback
};
