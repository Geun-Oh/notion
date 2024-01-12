import * as React from 'react'
import Image from 'next/image'

import * as types from 'notion-types'
import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp'
import { IoSunnyOutline } from '@react-icons/all-files/io5/IoSunnyOutline'
import cs from 'classnames'
import { Breadcrumbs, Search, useNotionContext } from 'react-notion-x'

import { isSearchEnabled, navigationLinks } from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'

import styles from './styles.module.css'

const ROOT_PAGE_ID = 'c40a54e2-42ae-4fbd-a373-2ff9df24b8d4'

const ToggleThemeButton = () => {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  const onToggleTheme = React.useCallback(() => {
    toggleDarkMode()
  }, [toggleDarkMode])

  return (
    <div
      className={cs('breadcrumb', 'button', !hasMounted && styles.hidden)}
      onClick={onToggleTheme}
    >
      {hasMounted && isDarkMode ? <IoMoonSharp /> : <IoSunnyOutline />}
    </div>
  )
}

export const NotionPageHeader: React.FC<{
  block: types.CollectionViewPageBlock | types.PageBlock
}> = ({ block }) => {
  const { components, mapPageUrl } = useNotionContext()

  // if (navigationStyle === 'default') {
  //   return <Header block={block} />
  // }
  console.log(block)

  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>
        <div className='notion-custom-breadcrumb'>
          {' '}
          <Breadcrumbs block={block} rootOnly={true} />
          {block.id !== ROOT_PAGE_ID && (
            <>
              <span className='spacer'>/</span>
              {block.parent_id !== ROOT_PAGE_ID && (
                <>
                  <components.PageLink
                    href={mapPageUrl(block.parent_id)}
                    className={cs(styles.navLink, 'title')}
                  >
                    {'...'}
                  </components.PageLink>
                  <span className='spacer'>/</span>
                </>
              )}

              {block.format &&
                block.format.page_icon &&
                typeof block.format.page_icon !== 'string' && (
                  <span
                    role='img'
                    aria-label={block.format.page_icon}
                    className={cs(
                      'icon',
                      'notion-page-icon',
                      'notion-breadcrumb-icon'
                    )}
                  ></span>
                )}
              {block.properties && block.properties.title && (
                <span className={cs('title', 'notion-nav-header-active')}>
                  {block.properties.title[0][0]}
                </span>
              )}
            </>
          )}
        </div>

        <div className='notion-nav-header-rhs breadcrumbs'>
          {navigationLinks
            ?.map((link, index) => {
              if (!link.pageId && !link.url) {
                return null
              }

              if (link.pageId) {
                return (
                  <components.PageLink
                    href={mapPageUrl(link.pageId)}
                    key={index}
                    className={cs(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.PageLink>
                )
              } else {
                return (
                  <components.Link
                    href={link.url}
                    key={index}
                    className={cs(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.Link>
                )
              }
            })
            .filter(Boolean)}

          <ToggleThemeButton />

          {isSearchEnabled && <Search block={block} title={null} />}
        </div>
      </div>
    </header>
  )
}
