'use client'
import { useEffect, useState } from 'react'

export default function Effects() {
  const [intro, setIntro] = useState<'show' | 'out' | 'gone'>('show')

  useEffect(() => {
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches
    let seen = false
    try { seen = !!sessionStorage.getItem('kp19intro') } catch {}
    const timers: number[] = []
    if (seen || rm) setIntro('gone')
    else {
      try { sessionStorage.setItem('kp19intro', '1') } catch {}
      timers.push(window.setTimeout(() => setIntro('out'), 1350), window.setTimeout(() => setIntro('gone'), 1950))
    }

    const nav = document.getElementById('nav')
    const onScroll = () => nav?.classList.toggle('solid', scrollY > 60)
    addEventListener('scroll', onScroll, { passive: true }); onScroll()

    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.2 })
    document.querySelectorAll('.rv').forEach(n => io.observe(n))

    const ol = document.getElementById('steps'), prog = document.getElementById('prog')
    const lis = Array.from(document.querySelectorAll<HTMLElement>('#steps li'))
    let disposed = false
    let cleanupTimeline = () => {}
    if (rm) lis.forEach(item => item.classList.add('on'))
    else if (ol && prog) {
      // Only the narrative timeline loads GSAP; regular reveals stay lightweight.
      Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return
        gsap.registerPlugin(ScrollTrigger)
        const context = gsap.context(() => {
          gsap.fromTo(prog, { height: 0 }, { height: () => ol.offsetHeight - 12, ease: 'none', scrollTrigger: { trigger: ol, start: 'top 60%', end: 'bottom 60%', scrub: true, invalidateOnRefresh: true } })
          lis.forEach(item => ScrollTrigger.create({ trigger: item, start: 'top 60%', onEnter: () => item.classList.add('on'), onLeaveBack: () => item.classList.remove('on') }))
        }, ol)
        cleanupTimeline = () => context.revert()
      }).catch(() => lis.forEach(item => item.classList.add('on')))
    }

    const art = document.getElementById('art')
    const move = (e: PointerEvent) => {
      if (!art) return
      const x = (e.clientX / innerWidth - 0.5) * 12, y = (e.clientY / innerHeight - 0.5) * 12
      art.style.transform = `translate(${x}px, calc(-46% + ${y}px))`
    }
    const par = !rm && matchMedia('(pointer: fine)').matches && innerWidth > 900
    if (par) addEventListener('pointermove', move, { passive: true })

    return () => { disposed = true; cleanupTimeline(); timers.forEach(clearTimeout); io.disconnect(); removeEventListener('scroll', onScroll); removeEventListener('pointermove', move) }
  }, [])

  if (intro === 'gone') return null
  return (
    <div id="intro" className={intro === 'out' ? 'out' : ''} aria-hidden="true">
      <div className="glow" />
      <div>
        <svg viewBox="0 0 100 100"><use href="#kp19-lotus" /></svg>
        <div className="t"><span>KHÔNG GIAN VĂN HÓA</span><span>HỒ CHÍ MINH</span><span>KHU PHỐ 19</span></div>
      </div>
    </div>
  )
}
