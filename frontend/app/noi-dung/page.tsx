'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import LandingSwitchNav from '@/components/shared/LandingSwitchNav';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 2, label: 'Thuộc tính của sức lao động' },
  { value: 4, label: 'Giờ lao động tất yếu (ví dụ 8h/ngày)' },
  { value: 15, label: 'USD giá trị thặng dư (ví dụ của Mác)' },
  { value: 100, label: "% tỷ suất m' cơ bản" },
];

const TIMELINE = [
  'Nhà tư bản mua sức lao động đúng giá thị trường.',
  'Công nhân vào xưởng và làm việc 8 giờ.',
  '4 giờ đầu (lao động tất yếu) tạo ra 15 USD đúng bằng tiền lương.',
  '4 giờ sau (lao động thặng dư) tạo thêm 15 USD thuộc về nhà tư bản.',
  'Tổng kết: thu 136 USD, chi 121 USD, phần dôi ra 15 USD là m.',
];

const METHODS = [
  {
    title: 'Giá trị thặng dư tuyệt đối',
    points: [
      'Kéo dài ngày lao động khi tiền lương không đổi.',
      "8h -> m' = 100% và 10h -> m' = 150% (ví dụ minh họa).",
      'Giới hạn bởi sức khỏe và đấu tranh của công nhân.',
    ],
  },
  {
    title: 'Giá trị thặng dư tương đối',
    points: [
      'Tăng năng suất lao động để rút ngắn thời gian tất yếu.',
      "Ví dụ: trong 8h, từ 4h tất yếu còn 2h tất yếu thì m' tăng mạnh.",
      'Là đặc trưng của chủ nghĩa tư bản hiện đại.',
    ],
  },
  {
    title: 'Giá trị thặng dư siêu ngạch',
    points: [
      'Năng suất cá biệt cao hơn năng suất xã hội.',
      'Chi phí cá biệt thấp hơn giá trị xã hội của hàng hóa.',
      'Là động lực cạnh tranh và đổi mới kỹ thuật.',
    ],
  },
];

const CONCLUSIONS = [
  'Giá trị thặng dư có nguồn gốc từ lao động sống của công nhân.',
  'Tiền công che giấu quá trình tạo ra giá trị thặng dư.',
  'Tư bản vận động liên tục để gia tăng giá trị thặng dư.',
];

type RevealDirection = 'up' | 'left' | 'right';

function Reveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: RevealDirection;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px 0px 0px',
      },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`landing-reveal landing-reveal-${direction} ${visible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

function AnimatedCounter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const node = ref.current;
    const counter = { current: 0 };
    const tween = gsap.to(counter, {
      current: target,
      duration: 1.4,
      ease: 'power3.out',
      roundProps: 'current',
      onUpdate: () => setValue(Math.max(0, counter.current)),
      scrollTrigger: {
        trigger: node,
        start: 'top 88%',
        toggleActions: 'play reverse play reverse',
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [target]);

  return <span ref={ref}>{value}</span>;
}

export default function ContentLandingPage() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const formulaLeftRef = useRef<HTMLParagraphElement>(null);
  const formulaRightRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    };

    const particles: Particle[] = [];
    let animationId = 0;

    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.length = 0;

      const count = Math.min(90, Math.max(40, Math.round(window.innerWidth / 20)));
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size: Math.random() * 1.8 + 0.4,
          alpha: Math.random() * 0.45 + 0.08,
          color: Math.random() > 0.4 ? '#ef4444' : '#f59e0b',
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 96) {
            ctx.strokeStyle = '#ef4444';
            ctx.globalAlpha = ((96 - distance) / 96) * 0.08;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    };

    setup();
    draw();

    const onResize = () => setup();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;

    if (!cursor || !ring || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let animationId = 0;

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      animationId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    animationId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const context = gsap.context(() => {
      gsap.from('.gsap-hero', {
        y: 36,
        opacity: 0,
        duration: 0.9,
        stagger: 0.16,
        ease: 'power3.out',
      });

      gsap.utils.toArray<HTMLElement>('.gsap-section').forEach((section) => {
        gsap.from(section, {
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            toggleActions: 'play reverse play reverse',
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('.gsap-card').forEach((card, index) => {
        gsap.from(card, {
          y: 26,
          opacity: 0,
          duration: 0.55,
          delay: (index % 4) * 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play reverse play reverse',
          },
        });
      });

      if (formulaLeftRef.current) {
        gsap.to(formulaLeftRef.current, {
          yPercent: 28,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      if (formulaRightRef.current) {
        gsap.to(formulaRightRef.current, {
          yPercent: 38,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <main ref={rootRef} className="landing-single-scroll relative min-h-screen overflow-x-clip">
      <canvas ref={canvasRef} className="landing-particles" />
      <div ref={cursorRef} className="landing-cursor hidden md:block" />
      <div ref={ringRef} className="landing-cursor-ring hidden md:block" />

      <LandingSwitchNav />

      <section className="relative overflow-hidden px-6 pb-24 pt-16 sm:pt-20">
        <div className="landing-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-mln-red/12 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-mln-gold/10 blur-3xl" />
        </div>

        <p
          ref={formulaLeftRef}
          className="pointer-events-none absolute left-2 top-18 text-6xl font-black tracking-[0.2em] text-mln-red/12 sm:left-6 sm:text-8xl"
        >
          m = m&apos; / v
        </p>
        <p
          ref={formulaRightRef}
          className="pointer-events-none absolute right-4 top-32 text-4xl font-black tracking-[0.2em] text-mln-gold/10 sm:text-6xl"
        >
          T - H - T&apos;
        </p>

        <div className="relative z-10 mx-auto max-w-6xl gsap-section">
          <Reveal>
            <p className="gsap-hero text-xs font-semibold uppercase tracking-[0.2em] text-mln-gold">
              Kinh Tế Chính Trị Mác-Lênin · Chương 3
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="gsap-hero mt-4 text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
              <span className="block gradient-text">Lý Luận</span>
              <span className="block text-mln-cream">Giá Trị</span>
              <span className="block text-mln-cream/90">Thặng Dư</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="gsap-hero mt-6 max-w-3xl text-base leading-relaxed text-mln-dim sm:text-lg">
              Công thức trung tâm: T - H - T&apos; với T&apos; = T + m. Mục đích của tư bản không phải giá trị sử dụng,
              mà là sự gia tăng giá trị thông qua bóc tách phần lao động thặng dư.
            </p>
          </Reveal>
          <Reveal delay={280}>
            <div className="gsap-hero mt-7 inline-flex rounded-xl border border-mln-gold/35 bg-mln-gold/10 px-5 py-2.5 text-sm font-semibold tracking-widest text-mln-gold sm:text-base">
              m&apos; = m / v x 100%
            </div>
          </Reveal>
        </div>
      </section>

      <section className="gsap-section px-6 pb-16">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
          <Reveal direction="left">
            <article className="mln-card gsap-card p-6">
              <p className="text-sm uppercase tracking-widest text-mln-red">Trích dẫn</p>
              <blockquote className="mt-3 text-2xl font-semibold leading-relaxed text-mln-cream">
                “Phần dôi ra chính là giá trị thặng dư.”
              </blockquote>
              <p className="mt-2 text-sm text-mln-dim">C. Mác</p>
            </article>
          </Reveal>

          <Reveal direction="right" delay={80}>
            <article className="glass-card gsap-card p-6">
              <h2 className="text-xl font-bold text-mln-cream">Công thức chung của tư bản</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-mln-dim">
                <li>H - T - H: bán để mua, mục đích là giá trị sử dụng.</li>
                <li>T - H - T&apos;: đầu tư để sinh lời, mục đích là giá trị thặng dư.</li>
                <li>Ví dụ H - T - H: laptop cũ -&gt; tiền -&gt; điện thoại.</li>
                <li>Ví dụ T - H - T&apos;: vốn 50tr -&gt; server/tool -&gt; thu 100tr.</li>
              </ul>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="gsap-section px-6 pb-16">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((item, index) => (
            <Reveal key={item.label} delay={index * 70}>
              <article className="glass-card gsap-card p-5 text-center transition hover:border-mln-red/25 hover:bg-white/6">
                <p className="text-4xl font-black text-mln-gold">
                  <AnimatedCounter target={item.value} />
                </p>
                <p className="mt-2 text-sm text-mln-dim">{item.label}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="gsap-section px-6 pb-16">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          <Reveal direction="left">
            <article className="glass-card gsap-card p-6">
              <h2 className="text-xl font-bold text-mln-cream">Giá trị sức lao động</h2>
              <p className="mt-3 leading-relaxed text-mln-dim">
                Giá trị sức lao động thể hiện bằng tiền lương, phản ánh chi phí sinh hoạt cần thiết để tái tạo sức lao động.
                Ví dụ: thuê một content creator với mức lương 10 triệu/tháng.
              </p>
            </article>
          </Reveal>

          <Reveal direction="right" delay={100}>
            <article className="mln-card gsap-card p-6">
              <h2 className="text-xl font-bold text-mln-cream">Giá trị sử dụng đặc biệt</h2>
              <p className="mt-3 leading-relaxed text-mln-dim">
                Sức lao động có khả năng tạo ra giá trị mới lớn hơn giá trị bản thân nó. Ví dụ: content creator lương 10 triệu
                nhưng tạo ra doanh thu 50 triệu.
              </p>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="gsap-section px-6 pb-16">
        <Reveal className="mx-auto max-w-6xl">
          <div className="gsap-card rounded-2xl border border-white/10 bg-white/3 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-mln-cream">Quá trình sản xuất giá trị thặng dư</h2>
            <ol className="mt-6 space-y-3">
              {TIMELINE.map((step, index) => (
                <li
                  key={step}
                  className="group flex gap-3 rounded-xl border border-white/8 bg-black/20 p-4 transition hover:border-mln-gold/30"
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mln-red/20 text-xs font-bold text-mln-gold transition group-hover:bg-mln-gold/20">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-mln-dim">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </section>

      <section className="gsap-section px-6 pb-16">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          <Reveal direction="left">
            <article className="glass-card gsap-card p-6">
              <h2 className="text-xl font-bold text-mln-cream">Tư bản bất biến (c)</h2>
              <ul className="mt-4 space-y-2 text-sm text-mln-dim">
                <li>Máy móc, nguyên vật liệu.</li>
                <li>Chỉ chuyển giá trị vào sản phẩm.</li>
                <li>Không tạo ra giá trị mới.</li>
                <li>Ví dụ: máy may, vải trong xưởng may.</li>
              </ul>
            </article>
          </Reveal>

          <Reveal direction="right" delay={100}>
            <article className="mln-card gsap-card p-6">
              <h2 className="text-xl font-bold text-mln-cream">Tư bản khả biến (v)</h2>
              <ul className="mt-4 space-y-2 text-sm text-mln-dim">
                <li>Tiền dùng để mua sức lao động.</li>
                <li>Nguồn gốc duy nhất tạo ra m.</li>
                <li>Tự tăng thêm giá trị trong sản xuất.</li>
                <li>Ví dụ: tiền lương công nhân may.</li>
              </ul>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="gsap-section px-6 pb-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-2xl font-bold text-mln-cream">Phương pháp sản xuất giá trị thặng dư</h2>
          </Reveal>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {METHODS.map((item, index) => (
              <Reveal key={item.title} delay={index * 80}>
                <article className="glass-card gsap-card p-6 transition hover:border-mln-red/30 hover:bg-white/6">
                  <h3 className="text-lg font-semibold text-mln-gold">{item.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-mln-dim">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="gsap-section px-6 pb-16">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          <Reveal direction="left">
            <article className="glass-card gsap-card p-6">
              <h2 className="text-xl font-bold text-mln-cream">Tiền công</h2>
              <p className="mt-3 leading-relaxed text-mln-dim">
                Tiền công che giấu bản chất bóc lột. Người lao động thường tưởng mình được trả đủ cho toàn bộ lao động,
                nhưng thực tế có thể tạo ra 50 triệu giá trị và chỉ nhận 10 triệu tiền lương.
              </p>
            </article>
          </Reveal>

          <Reveal direction="right" delay={100}>
            <article className="mln-card gsap-card p-6">
              <h2 className="text-xl font-bold text-mln-cream">Tuần hoàn tư bản</h2>
              <p className="mt-3 leading-relaxed text-mln-dim">
                T -&gt; SX -&gt; H -&gt; T&apos; và lặp lại liên tục. Chu chuyển càng nhanh thì khối lượng giá trị thặng dư càng lớn,
                nên tư bản luôn tối ưu tốc độ sản xuất, tiêu thụ và dòng tiền.
              </p>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="gsap-section px-6 pb-16">
        <Reveal className="mx-auto max-w-6xl">
          <div className="gsap-card rounded-2xl border border-mln-red/30 bg-linear-to-br from-mln-red/10 to-transparent p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-mln-cream">Kết luận</h2>
            <ol className="mt-4 space-y-3 text-mln-dim">
              {CONCLUSIONS.map((point, index) => (
                <li key={point} className="flex gap-3">
                  <span className="text-mln-gold">{index + 1}.</span>
                  <span>{point}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-sm font-medium text-mln-cream">
              Đây là cơ chế vận hành cơ bản của chủ nghĩa tư bản.
            </p>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-white/6 bg-mln-dark/85 px-6 py-10 text-center text-mln-dim backdrop-blur-xl">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-3xl font-black italic leading-tight text-mln-cream sm:text-4xl">
              &ldquo;Không có gì là vĩnh cửu ngoài{' '}
              <span className="text-mln-red">sự thay đổi</span>&rdquo;
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mx-auto mt-5 h-px w-24 bg-linear-to-r from-transparent via-mln-gold/70 to-transparent" />
          </Reveal>

          <Reveal delay={200}>
            <p className="mx-auto mt-5 max-w-136 wrap-break-words text-xs font-semibold uppercase leading-relaxed tracking-[0.22em] text-mln-dim/80 sm:max-w-none sm:tracking-[0.35em]">
              Kinh Tế Chính Trị Mác-Lênin · Giá Trị Thặng Dư · C. Mác
            </p>
          </Reveal>
        </div>
      </footer>
    </main>
  );
}
