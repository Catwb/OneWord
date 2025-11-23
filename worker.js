export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    
    // 路由处理
    if (url.pathname !== '/') {
      return new Response('Not Found', { status: 404 })
    }

    // CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    // 备用句子（CDN 失败时使用）
    const fallbackSentences = [
      { "sentence": "星光不问赶路人，时光不负有心人。" },
      { "sentence": "行到水穷处，坐看云起时。" }
    ]

    try {
      // 从 jsDelivr CDN 获取句子库
      const cdnUrl = 'https://cdn.jsdelivr.net/gh/Catwb/OneWord/oneword.json'
      
      const response = await fetch(cdnUrl, {
        // 使用 Cloudflare 缓存策略
        cf: {
          cacheTtl: 300,  // 缓存 5 分钟
          cacheEverything: true
        }
      })
      
      if (!response.ok) {
        throw new Error(`CDN 返回错误: ${response.status}`)
      }
      
      const sentences = await response.json()
      
      if (!Array.isArray(sentences) || sentences.length === 0) {
        throw new Error('句子库格式错误或为空')
      }
      
      // 随机抽取一句
      const randomIndex = Math.floor(Math.random() * sentences.length)
      const randomSentence = sentences[randomIndex]
      
      return jsonResponse(randomSentence)
      
    } catch (error) {
      // 失败时使用备用句子
      console.error('获取句子失败:', error.message)
      const randomFallback = fallbackSentences[Math.floor(Math.random() * fallbackSentences.length)]
      return jsonResponse(randomFallback, 503) // 返回 503 状态码表示服务降级
    }
  }
}

// 辅助函数：生成 JSON 响应
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=60', // 客户端缓存 1 分钟
    },
  })
}