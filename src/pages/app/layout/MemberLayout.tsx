import { Outlet } from 'react-router-dom'
import { useAdaptiveLayout } from '../../../hooks/useAdaptiveLayout'
import MemberSidebar from '../../../components/layout/MemberSidebar'
import MemberRail from '../../../components/layout/MemberRail'
import MemberTabBar from '../../../components/layout/MemberTabBar'

export default function MemberLayout() {
  const sizeClass = useAdaptiveLayout()

  const contentOffset =
    sizeClass === 'expanded'
      ? 'ml-[180px]'
      : sizeClass === 'regular'
        ? 'ml-16'
        : 'pb-[72px]'

  return (
    <div className='min-h-screen bg-surface-2 text-text-primary overflow-x-hidden'>
      {sizeClass === 'expanded' && <MemberSidebar />}
      {sizeClass === 'regular' && <MemberRail />}
      <div className={['flex flex-col min-w-0 max-w-full', contentOffset].join(' ')}>
        <Outlet />
      </div>
      {sizeClass === 'compact' && <MemberTabBar />}
    </div>
  )
}
