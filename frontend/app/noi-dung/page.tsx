'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import LandingSwitchNav from '@/components/shared/LandingSwitchNav';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 2, suffix: '', label: 'Thuộc tính của hàng hóa sức lao động' },
  { value: 4, suffix: 'h', label: 'Giờ lao động tất yếu (trong 8h/ngày)' },
  { value: 15, suffix: ' USD', label: 'Giá trị thặng dư (ví dụ kéo sợi)' },
  { value: 100, suffix: '%', label: "Tỷ suất m' ban đầu" },
];

const TIMELINE = [
  {
    title: 'Bước 1: Thuê lao động',
    desc: 'Nhà tư bản thuê thợ dệt, trả 15 USD/ngày cho 8 giờ làm việc.',
  },
  {
    title: 'Bước 2: 4 giờ tất yếu',
    desc: '50 USD bông + 3 USD hao mòn máy + 15 USD giá trị mới = 68 USD. 15 USD mới vừa đủ bù tiền lương.',
  },
  {
    title: 'Bước 3: 4 giờ thặng dư',
    desc: 'Thêm 50 USD bông + 3 USD máy và tạo thêm 15 USD giá trị mới. Tổng đợt hai tiếp tục là 68 USD.',
  },
  {
    title: 'Bước 4: Tổng kết 8 giờ',
    desc: 'Thu: 136 USD. Chi: 100 USD bông + 6 USD máy + 15 USD lương = 121 USD. Chênh lệch 15 USD là m.',
  },
  {
    title: 'Bước 5: Kết luận',
    desc: 'm là phần giá trị mới dôi ra ngoài giá trị sức lao động, do công nhân tạo ra và bị nhà tư bản chiếm đoạt.',
  },
];

const METHODS = [
  {
    title: 'Giá Trị Thặng Dư Tuyệt Đối',
    tag: 'Vắt Kiệt Thời Gian',
    points: [
      'Kéo dài ngày lao động, tiền lương không đổi.',
      "Ví dụ: 8h (4h tất yếu + 4h thặng dư) => m' = 100%; 10h (4h tất yếu + 6h thặng dư) => m' = 150%.",
      'Giới hạn: sức khỏe con người và đấu tranh công nhân.',
      'Đặc trưng: giai đoạn đầu của chủ nghĩa tư bản.',
    ],
  },
  {
    title: 'Giá Trị Thặng Dư Tương Đối',
    tag: 'Cách Mạng Năng Suất',
    points: [
      'Tăng năng suất lao động xã hội làm hàng tiêu dùng rẻ hơn.',
      "Giá trị sức lao động giảm => thời gian tất yếu giảm. Ví dụ 8h: 2h tất yếu + 6h thặng dư => m' = 300%.",
      'Đặc trưng của chủ nghĩa tư bản hiện đại, gắn với đổi mới kỹ thuật.',
    ],
  },
  {
    title: 'Giá Trị Thặng Dư Siêu Ngạch',
    tag: 'Lợi Thế Tiên Phong',
    points: [
      'Năng suất lao động cá biệt cao hơn năng suất xã hội.',
      'Chi phí cá biệt thấp hơn giá trị xã hội => thu m siêu ngạch.',
      'Doanh nghiệp tiên phong buộc toàn ngành đổi mới, cuối cùng tạo nền cho m tương đối.',
      'Là động lực mạnh thúc đẩy phát triển kỹ thuật.',
    ],
  },
];

const CONCLUSIONS = [
  'Nguồn gốc: m xuất phát từ lao động của công nhân.',
  'Che giấu: tiền công che giấu bản chất tạo ra m.',
  "Vận động: tư bản vận động liên tục theo công thức T - H - T' để gia tăng m.",
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
    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      },
    );

    observer.observe(node);
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

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
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
      duration: 1.2,
      ease: 'power3.out',
      roundProps: 'current',
      onUpdate: () => setValue(Math.max(0, counter.current)),
      scrollTrigger: {
        trigger: node,
        start: 'top 90%',
        toggleActions: 'play reverse play reverse',
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [target]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <article
      className={`h-full rounded-2xl border border-white/14 bg-black/30 p-6 backdrop-blur-xl shadow-[0_10px_32px_rgba(0,0,0,0.32)] ${className}`}
    >
      {children}
    </article>
  );
}

export default function ContentLandingPage() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const formulaLeftRef = useRef<HTMLParagraphElement>(null);
  const formulaRightRef = useRef<HTMLParagraphElement>(null);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

      const count = Math.min(110, Math.max(50, Math.round(window.innerWidth / 18)));
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.6 + 0.4,
          alpha: Math.random() * 0.42 + 0.08,
          color: Math.random() > 0.45 ? '#c0392b' : '#d4a017',
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
          if (distance < 90) {
            ctx.strokeStyle = '#c0392b';
            ctx.globalAlpha = ((90 - distance) / 90) * 0.12;
            ctx.lineWidth = 0.6;
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
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
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
        y: 34,
        opacity: 0,
        duration: 0.85,
        stagger: 0.15,
        ease: 'power3.out',
      });

      gsap.utils.toArray<HTMLElement>('.gsap-section').forEach((section) => {
        gsap.from(section, {
          y: 36,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 84%',
            toggleActions: 'play reverse play reverse',
          },
        });
      });

      const conclusionTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.gsap-conclusion',
          start: 'top 82%',
          toggleActions: 'play reverse play reverse',
        },
      });

      conclusionTl
        .from('.gsap-conclusion-title', {
          y: 26,
          opacity: 0,
          duration: 0.55,
          ease: 'power2.out',
        })
        .from(
          '.gsap-conclusion-item',
          {
            x: -24,
            opacity: 0,
            duration: 0.45,
            stagger: 0.12,
            ease: 'power2.out',
          },
          '-=0.2',
        )
        .from(
          '.gsap-conclusion-quote',
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.08',
        );

      if (formulaLeftRef.current) {
        gsap.to(formulaLeftRef.current, {
          yPercent: 24,
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
          yPercent: 34,
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
    <main ref={rootRef} className="landing-single-scroll font-body relative min-h-screen overflow-x-clip">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=EB+Garamond:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800;900&display=swap');

        .font-title {
          font-family: 'Playfair Display', serif;
        }

        .font-label {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.08em;
        }

        .font-kicker {
          font-family: var(--font-be-vietnam-pro), sans-serif;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .font-body {
          font-family: 'EB Garamond', serif;
          line-height: 1.55;
        }
      `}</style>

      <canvas ref={canvasRef} className="landing-particles" />
      <div ref={cursorRef} className="landing-cursor hidden md:block" />
      <div ref={ringRef} className="landing-cursor-ring hidden md:block" />

      <div
        className={`fixed left-0 right-0 top-0 z-40 h-16 border-b transition duration-300 sm:h-18 ${
          navScrolled ? 'border-[#d4a017]/30 bg-black/45 backdrop-blur-xl' : 'border-transparent bg-transparent'
        }`}
      />
      <LandingSwitchNav />

      <section className="relative overflow-hidden px-6 pb-24 pt-16 sm:pt-20">
        <div className="landing-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#c0392b]/18 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#d4a017]/12 blur-3xl" />
        </div>

        <p
          ref={formulaLeftRef}
          className="pointer-events-none absolute left-2 top-20 font-label text-6xl text-[#c0392b]/18 sm:left-8 sm:text-8xl"
        >
          T - H - T&apos;
        </p>
        <p
          ref={formulaRightRef}
          className="pointer-events-none absolute right-4 top-34 font-label text-4xl text-[#d4a017]/16 sm:text-6xl"
        >
          T&apos; = T + m
        </p>

        <div className="relative z-10 mx-auto max-w-6xl">
          <Reveal>
            <p className="gsap-hero font-kicker text-base text-[#d4a017]">Kinh Tế Chính Trị Mác-Lênin · Chương 3</p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="gsap-hero mt-5 font-title text-5xl font-black leading-[0.95] sm:text-7xl lg:text-8xl">
              <span className="block text-[#c0392b]">Lý Luận</span>
              <span className="block text-[#f6e2a3]">Giá Trị</span>
              <span className="block text-[#faf2d1]">Thặng Dư</span>
            </h1>
          </Reveal>
          <Reveal delay={170}>
            <p className="gsap-hero mt-7 max-w-3xl font-body text-xl leading-relaxed text-[#f0e6c4]">
              Chương 3: Giá Trị Thặng Dư Trong Nền Kinh Tế Thị Trường
            </p>
            <p className="gsap-hero mt-2 font-kicker text-lg text-[#d4a017]">Nguồn gốc · Bản chất · Phương pháp sản xuất</p>
          </Reveal>

          <Reveal delay={240}>
            <div className="gsap-hero mt-8 inline-flex rounded-xl border border-[#d4a017]/40 bg-[#d4a017]/10 px-5 py-3 font-label text-lg text-[#f6e2a3]">
              T - H - T&apos; (T&apos; = T + m)
            </div>
          </Reveal>

          <div className="landing-scroll-cue">
            <span className="font-label">SCROLL</span>
            <span className="landing-scroll-line" />
          </div>
        </div>
      </section>

      <section className="gsap-section px-6 pb-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-title text-4xl font-bold text-[#f9edc3]">I. Lý Luận của C. Mác về Giá Trị Thặng Dư</h2>
            <p className="mt-2 font-body text-2xl text-[#d4a017]">1. Nguồn gốc của giá trị thặng dư</p>
          </Reveal>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <Reveal direction="left">
              <Card className="border-[#c0392b]/45">
                <p className="font-kicker text-xl text-[#d4a017]">H - T - H (Lưu thông hàng hóa giản đơn)</p>
                <ul className="mt-3 space-y-2 text-lg leading-relaxed text-[#f1e6c5]">
                  <li>Bán thứ mình có để mua thứ mình cần.</li>
                  <li>Mục đích: giá trị sử dụng (tiêu dùng).</li>
                  <li>Ví dụ: Laptop cũ → 5 triệu → Điện thoại mới. Kết thúc.</li>
                </ul>
              </Card>
            </Reveal>

            <Reveal direction="right" delay={60}>
              <Card className="border-[#d4a017]/45">
                <p className="font-kicker text-xl text-[#d4a017]">T - H - T&apos; (Lưu thông tư bản)</p>
                <ul className="mt-3 space-y-2 text-lg leading-relaxed text-[#f1e6c5]">
                  <li>Bỏ tiền đầu tư để thu tiền lớn hơn: T&apos; = T + m (m &gt; 0).</li>
                  <li>Mục đích: giá trị thặng dư (lợi nhuận).</li>
                  <li>Ví dụ: 50 triệu → server + tool → thu 100 triệu. Lặp lại mãi.</li>
                </ul>
              </Card>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <Card className="mt-5 border-[#c0392b]/45 bg-[#c0392b]/12 p-5">
              <p className="text-xl leading-relaxed text-[#f8e9c4]">
                Bí mật: mua rẻ bán đắt không tạo giá trị mới cho xã hội. Nguồn gốc thực sự là nhà tư bản mua được hàng hóa
                đặc biệt: <span className="font-kicker text-2xl text-[#d4a017]">SỨC LAO ĐỘNG</span>.
              </p>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="gsap-section px-6 pb-16">
        <div className="mx-auto grid max-w-6xl items-stretch gap-5 md:grid-cols-2">
          <Reveal direction="left" className="h-full">
            <Card>
              <h3 className="font-title text-3xl text-[#f9edc3]">Giá trị (cơ sở tiền lương)</h3>
              <p className="mt-3 text-xl leading-relaxed text-[#f1e6c5]">
                Toàn bộ chi phí sinh hoạt (ăn, ở, mặc, học tập, nuôi con...) để người lao động duy trì và tái tạo sức làm
                việc.
              </p>
              <p className="mt-3 rounded-lg border border-[#d4a017]/35 bg-black/30 px-3 py-2 text-lg text-[#d4a017]">
                Ví dụ: Content Creator cần 10 triệu/tháng để sống → lương 10 triệu.
              </p>
            </Card>
          </Reveal>

          <Reveal direction="right" delay={80} className="h-full">
            <Card className="border-[#d4a017]/40">
              <h3 className="font-title text-3xl text-[#f9edc3]">Giá trị sử dụng (tính năng đặc biệt)</h3>
              <p className="mt-3 text-xl leading-relaxed text-[#f1e6c5]">
                Khi sử dụng, sức lao động không chỉ bù đắp giá trị bản thân mà còn tạo ra giá trị mới lớn hơn. Đây là chìa
                khóa giải mã m.
              </p>
              <p className="mt-3 rounded-lg border border-[#c0392b]/35 bg-black/30 px-3 py-2 text-lg text-[#d4a017]">
                Ví dụ: Content Creator đó mang về doanh thu 50 triệu/tháng.
              </p>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="gsap-section px-6 pb-16">
        <div className="mx-auto max-w-6xl rounded-2xl border border-white/12 bg-white/4 p-6 sm:p-8">
          <Reveal>
            <h3 className="font-title text-4xl text-[#f9edc3]">Bí Mật 8 Giờ Làm Việc</h3>
          </Reveal>

          <ol className="mt-6 space-y-3">
            {TIMELINE.map((item, index) => (
              <Reveal key={item.title} delay={index * 60}>
                <li className="group flex gap-3 rounded-xl border border-white/10 bg-black/25 p-4 transition hover:border-[#d4a017]/50">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#d4a017]/40 bg-[#d4a017]/12 font-label text-sm text-[#f6e2a3] transition group-hover:shadow-[0_0_14px_rgba(212,160,23,0.7)]">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-title text-2xl text-[#f6e9c6]">{item.title}</p>
                    <p className="font-body text-lg leading-relaxed text-[#eadcb4]">{item.desc}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="gsap-section px-6 pb-16">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((item, index) => (
            <Reveal key={item.label} delay={index * 70}>
              <Card className="group relative overflow-hidden p-5 transition hover:border-[#d4a017]/50 hover:shadow-[0_0_28px_rgba(212,160,23,0.2)]">
                <span className="pointer-events-none absolute -right-2 -top-5 font-label text-7xl text-[#d4a017]/7 transition group-hover:text-[#d4a017]/22">
                  {item.value}
                </span>
                <p className="font-label text-5xl text-[#d4a017]">
                  <AnimatedCounter target={item.value} suffix={item.suffix} />
                </p>
                <p className="mt-2 text-lg text-[#eadcb4]">{item.label}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="gsap-section px-6 pb-16">
        <div className="mx-auto max-w-6xl rounded-2xl border border-white/12 bg-white/4 p-6 sm:p-8">
          <Reveal>
            <p className="text-center font-label text-3xl text-[#d4a017]">G = c + (v + m)</p>
          </Reveal>

          <div className="mt-6 grid items-stretch gap-5 md:grid-cols-2">
            <Reveal direction="left" className="h-full">
              <Card>
                <h3 className="font-title text-3xl text-[#f8e7c0]">Tư bản bất biến (c)</h3>
                <p className="mt-3 font-kicker text-sm uppercase text-[#d4a017]">Khái niệm</p>
                <ul className="mt-3 space-y-2 text-lg leading-relaxed text-[#eadcb4]">
                  <li>
                    <strong className="text-[#f8e7c0]">Máy móc, thiết bị, nguyên vật liệu</strong>.
                  </li>
                  <li>
                    <strong className="text-[#f8e7c0]">Lao động cụ thể</strong> chỉ bảo toàn và chuyển giá trị vào sản phẩm.
                  </li>
                  <li>
                    <strong className="text-[#f8e7c0]">Không tạo ra giá trị mới</strong>.
                  </li>
                  <li>Ví dụ: máy may và vải chuyển giá trị vào áo, không sinh thêm.</li>
                </ul>

                <p className="mt-4 font-kicker text-sm uppercase text-[#d4a017]">Mối quan hệ với tư bản khả biến</p>
                <p className="mt-2 text-lg leading-relaxed text-[#eadcb4]">
                  <strong className="text-[#f8e7c0]">c</strong> tạo điều kiện vật chất cho sản xuất, còn{' '}
                  <strong className="text-[#f8e7c0]">v</strong> mới là bộ phận trực tiếp tạo ra giá trị mới. Vì vậy{' '}
                  <strong className="text-[#f8e7c0]">c và v luôn cùng tồn tại</strong>, nhưng{' '}
                  <strong className="text-[#f8e7c0]">vai trò tạo m chỉ thuộc về v</strong>.
                </p>
              </Card>
            </Reveal>

            <Reveal direction="right" delay={80} className="h-full">
              <Card className="border-[#d4a017]/45">
                <h3 className="font-title text-3xl text-[#f8e7c0]">Tư bản khả biến (v)</h3>
                <p className="mt-3 font-kicker text-sm uppercase text-[#d4a017]">Khái niệm</p>
                <ul className="mt-3 space-y-2 text-lg leading-relaxed text-[#eadcb4]">
                  <li>
                    <strong className="text-[#f8e7c0]">Tiền mua hàng hóa sức lao động</strong>.
                  </li>
                  <li>
                    <strong className="text-[#f8e7c0]">Lao động trừu tượng</strong> tạo ra giá trị mới lớn hơn.
                  </li>
                  <li>
                    <strong className="text-[#f8e7c0]">Nguồn duy nhất tạo ra giá trị thặng dư</strong>.
                  </li>
                  <li>Ví dụ: nhận 200.000đ/ngày, tạo 500.000đ giá trị → m = 300.000đ.</li>
                </ul>

                <p className="mt-4 font-kicker text-sm uppercase text-[#d4a017]">Ý nghĩa thực tiễn</p>
                <p className="mt-2 text-lg leading-relaxed text-[#eadcb4]">
                  Phân chia c và v giúp nhận rõ nguồn gốc m đến từ lao động sống của công nhân, đồng thời là cơ sở để doanh nghiệp
                  kết hợp đầu tư công nghệ với nâng cao năng suất lao động.
                </p>
              </Card>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <p className="mt-5 rounded-xl border border-[#c0392b]/45 bg-[#c0392b]/10 px-4 py-3 text-xl text-[#f2dfb5]">
              Ý nghĩa: máy móc và vốn không tạo ra m. Chỉ lao động của con người mới tạo ra giá trị mới.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="gsap-section px-6 pb-16">
        <div className="mx-auto grid max-w-6xl items-stretch gap-5 md:grid-cols-2">
          <Reveal direction="left" className="h-full">
            <Card>
              <h3 className="font-title text-3xl text-[#f8e7c0]">Tiền công</h3>
              <p className="mt-3 font-kicker text-sm uppercase text-[#d4a017]">Khái niệm</p>
              <ul className="mt-3 space-y-2 text-lg leading-relaxed text-[#eadcb4]">
                <li>
                  Khái niệm: <strong className="text-[#f8e7c0]">giá cả hàng hóa sức lao động</strong>.
                </li>
                <li>
                  Quan hệ: công nhân tạo ra <strong className="text-[#f8e7c0]">(v + m)</strong>, chỉ nhận{' '}
                  <strong className="text-[#f8e7c0]">v</strong>.
                </li>
                <li>
                  Che giấu: <strong className="text-[#f8e7c0]">người lao động tưởng được trả đủ</strong>.
                </li>
                <li>Ví dụ: nhận 8 triệu/tháng nhưng tạo giá trị lớn hơn cho doanh nghiệp.</li>
              </ul>

              <p className="mt-4 font-kicker text-sm uppercase text-[#d4a017]">Mối quan hệ</p>
              <p className="mt-2 text-lg leading-relaxed text-[#eadcb4]">
                <strong className="text-[#f8e7c0]">Tiền công gắn trực tiếp với tư bản khả biến</strong>: công nhân tạo tổng giá
                trị mới <strong className="text-[#f8e7c0]">(v + m)</strong> nhưng chỉ nhận lại{' '}
                <strong className="text-[#f8e7c0]">v</strong> dưới dạng lương, phần{' '}
                <strong className="text-[#f8e7c0]">m thuộc về nhà tư bản</strong>.
              </p>

              <p className="mt-4 font-kicker text-sm uppercase text-[#d4a017]">Ý nghĩa</p>
              <p className="mt-2 text-lg leading-relaxed text-[#eadcb4]">
                Giúp người lao động hiểu rõ quyền lợi của mình và giúp doanh nghiệp xây dựng chính sách lương hợp lý, hài hòa lợi
                ích các bên.
              </p>
            </Card>
          </Reveal>

          <Reveal direction="right" delay={90} className="h-full">
            <Card className="border-[#d4a017]/45">
              <h3 className="font-title text-3xl text-[#f8e7c0]">Tuần hoàn và chu chuyển tư bản</h3>
              <p className="mt-3 font-kicker text-sm uppercase text-[#d4a017]">Khái niệm</p>
              <ul className="mt-3 space-y-2 text-lg leading-relaxed text-[#eadcb4]">
                <li>
                  Mô hình: <strong className="text-[#f8e7c0]">T - H ... SX ... H&apos; - T&apos;</strong>.
                </li>
                <li>
                  <strong className="text-[#f8e7c0]">Tuần hoàn</strong>: tiền tệ → sản xuất → hàng hóa → tiền tệ.
                </li>
                <li>
                  <strong className="text-[#f8e7c0]">Chu chuyển</strong>: lặp lại liên tục theo thời gian.
                </li>
                <li>Ví dụ: 5 chu kỳ/năm → chu chuyển 5 vòng/năm.</li>
              </ul>

              <p className="mt-4 font-kicker text-sm uppercase text-[#d4a017]">Mối quan hệ</p>
              <p className="mt-2 text-lg leading-relaxed text-[#eadcb4]">
                <strong className="text-[#f8e7c0]">Tuần hoàn</strong> là một vòng vận động hoàn chỉnh;{' '}
                <strong className="text-[#f8e7c0]">chu chuyển</strong> là nhiều vòng tuần hoàn lặp lại theo thời gian.{' '}
                <strong className="text-[#f8e7c0]">Sản xuất tạo m</strong>, còn{' '}
                <strong className="text-[#f8e7c0]">lưu thông hiện thực hóa m thành tiền</strong>.
              </p>

              <p className="mt-4 font-kicker text-sm uppercase text-[#d4a017]">Ý nghĩa</p>
              <p className="mt-2 text-lg leading-relaxed text-[#eadcb4]">
                Muốn nâng cao hiệu quả kinh doanh, doanh nghiệp phải rút ngắn thời gian sản xuất và đẩy nhanh tiêu thụ, vì chu
                chuyển càng nhanh thì m càng nhiều.
              </p>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="gsap-section bg-[#5a1a16] px-6 py-16">
        <div className="mx-auto grid max-w-6xl items-stretch gap-6 md:grid-cols-2">
          <Reveal direction="left" className="h-full">
            <Card className="border-[#d4a017]/35 bg-black/20">
              <p className="font-kicker text-5xl text-[#f6df9b]">8 GIỜ LÀM VIỆC</p>
              <ul className="mt-4 space-y-2 text-xl leading-relaxed text-[#f8e7c0]">
                <li>4h tất yếu = 15 USD (trả lương)</li>
                <li>4h thặng dư = 15 USD (thuộc nhà tư bản)</li>
                <li className="font-label text-3xl text-[#d4a017]">m&apos; = 100%</li>
              </ul>
            </Card>
          </Reveal>

          <Reveal direction="right" delay={90} className="h-full">
            <Card className="border-[#f6df9b]/35 bg-black/20">
              <h3 className="font-title text-3xl text-[#f8e7c0]">Bản chất giá trị thặng dư</h3>
              <ol className="mt-4 space-y-3 text-lg leading-relaxed text-[#f2dfb5]">
                <li>
                  1) m là phần giá trị mới dôi ra ngoài giá trị sức lao động, do công nhân tạo ra, bị nhà tư bản chiếm lấy.
                </li>
                <li>
                  2) Không chỉ là con số kinh tế mà là quan hệ giai cấp: mua sức lao động đúng giá thị trường nhưng khai thác
                  giá trị lớn hơn.
                </li>
                <li>3) Bề mặt thị trường bình đẳng, bóc lột diễn ra bên trong xưởng sản xuất.</li>
              </ol>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="gsap-section px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h3 className="font-title text-4xl text-[#f8e7c0]">Làm thế nào để có nhiều m hơn?</h3>
          </Reveal>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {METHODS.map((method, index) => (
              <Reveal key={method.title} delay={index * 70}>
                <Card className="h-full border-[#d4a017]/30 transition hover:border-[#d4a017]/55 hover:shadow-[0_0_35px_rgba(212,160,23,0.18)]">
                  <p className="font-kicker text-sm text-[#d4a017]">{method.tag}</p>
                  <h4 className="mt-1 font-title text-3xl text-[#f8e7c0]">{method.title}</h4>
                  <ul className="mt-3 space-y-2 text-lg leading-relaxed text-[#eadcb4]">
                    {method.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="gsap-section gsap-conclusion px-6 pb-16">
        <div className="mx-auto max-w-6xl rounded-2xl border border-[#c0392b]/45 bg-[#c0392b]/12 p-6 sm:p-8">
          <Reveal>
            <h3 className="gsap-conclusion-title font-title text-4xl text-[#f8e7c0]">Kết luận</h3>
          </Reveal>

          <ol className="mt-4 space-y-2 text-2xl leading-relaxed text-[#f2dfb5]">
            {CONCLUSIONS.map((point, index) => (
              <li key={point} className="gsap-conclusion-item">
                {index + 1}. {point}
              </li>
            ))}
          </ol>

          <Reveal delay={120}>
            <blockquote className="gsap-conclusion-quote mt-6 border-l-2 border-[#d4a017]/55 pl-4 font-title text-3xl italic text-[#f9edc3]">
              “Tư bản là giá trị mang lại giá trị thặng dư” — C. Mác
            </blockquote>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
