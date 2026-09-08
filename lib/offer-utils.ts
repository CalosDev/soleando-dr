export interface ParsedIncludeItem {
  emoji?: string | null
  text: string
}

export interface ParsedOfferContent {
  narrativeParagraphs: string[]
  route: string[]
  includes: ParsedIncludeItem[]
}

/**
 * Parses and organizes offer text:
 * 1. Extracts introductory narrative paragraphs.
 * 2. Detects route stops if '📍 ...' is found.
 * 3. Identifies emoji-bulleted or symbol-bulleted inclusion items.
 * 4. Merges with dbIncludes gracefully.
 */
export function parseOfferContent(
  rawDescription?: string | null,
  dbIncludes?: string[] | null
): ParsedOfferContent {
  let narrative = (rawDescription || '').trim()
  let route: string[] = []
  const extractedIncludes: ParsedIncludeItem[] = []

  // 1. Extract Route if pattern '📍 ...' is present
  const routeMatch = narrative.match(/📍\s*([^\n\p{Extended_Pictographic}]+)/u)
  if (routeMatch) {
    const rawRoute = routeMatch[1].trim()
    route = rawRoute.split(/[•·\-\>\/]/).map((s) => s.trim()).filter(Boolean)
    narrative = narrative.replace(routeMatch[0], ' ')
  }

  // 2. Identify where inclusions / feature bullets begin
  const listStartMatch = narrative.match(
    /(?:✈️|✈|🚐|🚌|🏨|🏙️|🛕|🐘|🌿|🌏|🌍|🌎|🚤|🛥️|🛳️|🚢|🍽️|🛡️|🎫|⛵|⭐|✅|✔|✓)/u
  )

  if (listStartMatch && listStartMatch.index !== undefined) {
    const startIdx = listStartMatch.index
    const includesBlock = narrative.slice(startIdx)
    narrative = narrative.slice(0, startIdx).trim()

    // Match all (emoji) + (text)
    const matches = [
      ...includesBlock.matchAll(
        /(\p{Extended_Pictographic}+(?:\uFE0F|\u200D\p{Extended_Pictographic}+)*)\s*([^(\p{Extended_Pictographic})\n]+)/gu
      ),
    ]

    for (const m of matches) {
      const emoji = m[1].trim()
      const text = m[2].trim().replace(/[•·\-,;]$/, '')
      if (text.length > 3) {
        extractedIncludes.push({ emoji, text })
      }
    }
  } else {
    // Check if text has newline-bullet lines (starting with • or - or *)
    const lines = narrative.split('\n').map((l) => l.trim()).filter(Boolean)
    const bulletLines = lines.filter((l) => /^[•\-\*✓✔✅]\s+/.test(l))
    if (bulletLines.length >= 2) {
      const nonBulletLines: string[] = []
      for (const line of lines) {
        if (/^[•\-\*✓✔✅]\s+/.test(line)) {
          extractedIncludes.push({
            emoji: null,
            text: line.replace(/^[•\-\*✓✔✅]\s+/, '').trim(),
          })
        } else {
          nonBulletLines.push(line)
        }
      }
      narrative = nonBulletLines.join('\n\n')
    }
  }

  // Clean narrative: remove flag sequences, regional indicators, or trailing sparkles/country codes
  narrative = narrative
    .replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, '') // Regional indicator flags
    .replace(/[✨✦⭐]/gu, '')
    .replace(/\b[A-Z]{2}\b\s*$/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  // Split narrative into distinct paragraphs (preserving natural breaks)
  const narrativeParagraphs = narrative
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  // Determine final includes: if DB already had includes, preserve them (or add extracted ones if DB was empty)
  let finalIncludes: ParsedIncludeItem[] = []
  if (dbIncludes && dbIncludes.length > 0) {
    finalIncludes = dbIncludes.map((item) => ({ emoji: null, text: item }))
  } else {
    finalIncludes = extractedIncludes
  }

  return {
    narrativeParagraphs: narrativeParagraphs.length > 0 ? narrativeParagraphs : [narrative],
    route,
    includes: finalIncludes,
  }
}
