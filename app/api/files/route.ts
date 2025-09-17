import { NextRequest, NextResponse } from 'next/server'
import { readdir, stat, unlink } from 'fs/promises'
import { join } from 'path'

interface FileInfo {
  name: string
  path: string
  size: number
  created: string
}

export async function GET(request: NextRequest) {
  try {
    const downloadPath = join(process.cwd(), 'download')
    
    // Read all files in the download directory
    const files = await readdir(downloadPath, { withFileTypes: true })
    
    // Filter only files (not directories) and get their metadata
    const fileInfos: FileInfo[] = []
    
    for (const file of files) {
      if (file.isFile()) {
        const filePath = join(downloadPath, file.name)
        try {
          const stats = await stat(filePath)
          fileInfos.push({
            name: file.name,
            path: filePath,
            size: stats.size,
            created: stats.birthtime.toISOString()
          })
        } catch (statError) {
          console.error(`Error getting stats for ${file.name}:`, statError)
          // Still include the file but with default values
          fileInfos.push({
            name: file.name,
            path: filePath,
            size: 0,
            created: new Date().toISOString()
          })
        }
      }
    }
    
    return NextResponse.json({ files: fileInfos })
  } catch (error) {
    console.error('Error reading download directory:', error)
    return NextResponse.json(
      { error: 'Failed to read download directory' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path')
    
    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      )
    }
    
    // Verify the file is within the download directory for security
    const downloadPath = join(process.cwd(), 'download')
    const resolvedPath = join(downloadPath, filePath)
    
    if (!resolvedPath.startsWith(downloadPath)) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      )
    }
    
    await unlink(resolvedPath)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}
