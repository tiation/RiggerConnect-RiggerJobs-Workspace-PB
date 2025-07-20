import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json(
      { 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'rigger-marketing-web',
        version: process.env.npm_package_version || '1.0.0'
      }, 
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        timestamp: new Date().toISOString(),
        error: 'Health check failed' 
      }, 
      { status: 500 }
    )
  }
}