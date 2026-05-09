import { Logo } from '@/assets/Logo'
import { SearchDialog } from '@/components/SearchDialog'
import { ThemeDropdown } from '@/components/ThemeDropdown'

export const TopAppBar = () => {
  return (
    <div className='h-16 lg:my-4'>
      <header className='fixed top-0 left-0 z-50 flex h-16 gap-5 w-full items-center justify-between border-b bg-background/50 px-4 backdrop-blur-lg lg:left-4 lg:right-4 lg:top-4 lg:mx-auto lg:max-w-384 lg:rounded-2xl lg:border lg:w-auto'>
        <Logo
          variant='default'
          size={28}
        />
        <SearchDialog />
        <div className="flex gap-2">
            <ThemeDropdown />
        </div>
      </header>
    </div>
  )
}
