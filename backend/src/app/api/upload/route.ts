import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/upload'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, msg: '请选择文件' },
        { status: 400 }
      )
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, msg: '不支持的文件类型' },
        { status: 400 }
      )
    }

    // 检查文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, msg: '文件大小不能超过5MB' },
        { status: 400 }
      )
    }

    const buffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(buffer)
    
    const url = await uploadFile(fileBuffer, file.name, file.type)

    return NextResponse.json({
      success: true,
      data: { url }
    })
  } catch (error) {
    console.error('Upload file error:', error)
    return NextResponse.json(
      { success: false, msg: '文件上传失败' },
      { status: 500 }
    )
  }
}