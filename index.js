// 导入句子库
import sentences from '../oneword.json'

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    
    // 只处理 / 路径的请求
    if (url.pathname !== '/') {
      return new Response('Not Found', { status: 404 })
    }

    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    // 随机抽取一句
    const randomIndex = Math.floor(Math.random() * sentences.length)
    const randomSentence = sentences[randomIndex]

    // 返回 JSON 响应
    const response = new Response(JSON.stringify(randomSentence), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*', // 允许跨域
      },
    })

    return response
  }
}