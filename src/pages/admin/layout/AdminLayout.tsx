import { Outlet } from 'react-router-dom'
import { useAdaptiveLayout } from '../../../hooks/useAdaptiveLayout'
import SidebarFull from '../../../components/layout/SidebarFull'
import NavigationRail from '../../../components/layout/NavigationRail'
import BottomTabBar from '../../../components/layout/BottomTabBar'

export default function AdminLayout() {
  const sizeClass = useAdaptiveLayout()

  const contentOffset =
    sizeClass === 'expanded'
      ? 'ml-[200px]'
      : sizeClass === 'regular'
        ? 'ml-16'
        : 'pb-[72px]'

  return (
    <div className='min-h-screen bg-surface-2 text-text-primary overflow-x-hidden'>
      {sizeClass === 'expanded' && <SidebarFull />}
      {sizeClass === 'regular' && <NavigationRail />}
      <div className={['flex flex-col min-w-0 max-w-full', contentOffset].join(' ')}>
        <Outlet />
      </div>
      {sizeClass === 'compact' && <BottomTabBar />}
    </div>
  )
}
