import { NextRequest, NextResponse } from 'next/server'
import { readdir, stat, unlink, rmdir } from 'fs/promises'
import { join } from 'path'

interface FileInfo {
  name: string
  path: string
  size: number
  created: string
  isDirectory: boolean
}

export async function GET(request: NextRequest) {
  try {
    const downloadPath = join(process.cwd(), 'download')
    
    // Read all files and directories in the download directory
    const items = await readdir(downloadPath, { withFileTypes: true })
    
    // Get metadata for both files and directories
    const fileInfos: FileInfo[] = []
    
    for (const item of items) {
      const itemPath = join(downloadPath, item.name)
      try {
        const stats = await stat(itemPath)
        fileInfos.push({
          name: item.name,
          path: itemPath,
          size: item.isDirectory() ? 0 : stats.size, // Directories have size 0
          created: stats.birthtime.toISOString(),
          isDirectory: item.isDirectory()
        })
      } catch (statError) {
        console.error(`Error getting stats for ${item.name}:`, statError)
        // Still include the item but with default values
        fileInfos.push({
          name: item.name,
          path: itemPath,
          size: 0,
          created: new Date().toISOString(),
          isDirectory: item.isDirectory()
        })
      }
    }
    
    // Sort items: directories first, then files, both alphabetically
    fileInfos.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1
      if (!a.isDirectory && b.isDirectory) return 1
      return a.name.localeCompare(b.name)
    })
    
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
    const itemPath = searchParams.get('path')
    
    if (!itemPath) {
      return NextResponse.json(
        { error: 'Item path is required' },
        { status: 400 }
      )
    }
    
    // Verify the item is within the download directory for security
    const downloadPath = join(process.cwd(), 'download')
    const resolvedPath = join(downloadPath, itemPath)
    
    if (!resolvedPath.startsWith(downloadPath)) {
      return NextResponse.json(
        { error: 'Invalid item path' },
        { status: 400 }
      )
    }
    
    // Check if it's a directory or file and delete accordingly
    const stats = await stat(resolvedPath)
    if (stats.isDirectory()) {
      await rmdir(resolvedPath, { recursive: true })
    } else {
      await unlink(resolvedPath)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}
