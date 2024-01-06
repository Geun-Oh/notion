import { ExtendedRecordMap } from 'notion-types'
import {
  getCanonicalPageId as getCanonicalPageIdImpl,
  parsePageId
} from 'notion-utils'

import { inversePageUrlOverrides } from './config'

export function getCanonicalPageId(
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | null {
  const cleanPageId = parsePageId(pageId, { uuid: false })
  if (!cleanPageId) {
    return null
  }

  const override = inversePageUrlOverrides[cleanPageId]
  if (override) {
    return override
  } else {
    const urlPath = getCanonicalPageIdImpl(pageId, recordMap, {
      uuid
    })
    const a = urlPath.split('-').slice(0, -1).join('')
    const englishRegex = /[A-Za-z]/g

    if (a.match(englishRegex)) {
      return urlPath.split('-').slice(0, -1).join('-')
    } else {
      return pageId
    }
  }
}
