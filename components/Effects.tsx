'use client'
import { useEffect } from 'react'

export default function Effects() {
  useEffect(() => {
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches

    const nav = document.getElementById('nav')
    const onScroll = () => nav?.classList.toggle('solid', scrollY > 60)
    addEventListener('scroll', onScroll, { passive: true }); onScroll()

    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.2 })
    document.querySelectorAll('.rv').forEach(n => io.observe(n))

    const ol = document.getElementById('steps'), prog = document.getElementById('prog')
    const lis = Array.from(document.querySelectorAll<HTMLElement>('#steps li'))
    let disposed = false
    let cleanupTimeline = () => {}
    let timelineObserver: IntersectionObserver | undefined
    if (rm) lis.forEach(item => item.classList.add('on'))
    else if (ol && prog) {
      // Only the narrative timeline loads GSAP; regular reveals stay lightweight.
      const loadTimeline = () => Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return
        gsap.registerPlugin(ScrollTrigger)
        const context = gsap.context(() => {
          gsap.fromTo(prog, { height: 0 }, { height: () => ol.offsetHeight - 12, ease: 'none', scrollTrigger: { trigger: ol, start: 'top 60%', end: 'bottom 60%', scrub: true, invalidateOnRefresh: true } })
          lis.forEach(item => ScrollTrigger.create({ trigger: item, start: 'top 60%', onEnter: () => item.classList.add('on'), onLeaveBack: () => item.classList.remove('on') }))
        }, ol)
        cleanupTimeline = () => context.revert()
      }).catch(() => lis.forEach(item => item.classList.add('on')))
      timelineObserver = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return
        timelineObserver?.disconnect()
        void loadTimeline()
      }, { rootMargin: '200px' })
      timelineObserver.observe(ol)
    }

    const art = document.getElementById('art')
    const move = (e: PointerEvent) => {
      if (!art) return
      const x = (e.clientX / innerWidth - 0.5) * 12, y = (e.clientY / innerHeight - 0.5) * 12
      art.style.transform = `translate(${x}px, calc(-46% + ${y}px))`
    }
    const par = !rm && matchMedia('(pointer: fine)').matches && innerWidth > 900
    if (par) addEventListener('pointermove', move, { passive: true })

    return () => { disposed = true; timelineObserver?.disconnect(); cleanupTimeline(); io.disconnect(); removeEventListener('scroll', onScroll); removeEventListener('pointermove', move) }
  }, [])

  return null
}
