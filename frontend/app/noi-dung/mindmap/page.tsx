import Link from 'next/link';

import LandingSwitchNav from '@/components/shared/LandingSwitchNav';

type Tone = 'violet' | 'cyan' | 'lime' | 'amber' | 'pink';

type BranchNode = {
  title: string;
  details?: string[];
};

type Branch = {
  title: string;
  tone: Tone;
  nodes: BranchNode[];
};

type MindmapSection = {
  title: string;
  center: string;
  branches: Branch[];
  minWidth: string;
};

const toneStyles: Record<Tone, { header: string; line: string; node: string; detail: string }> = {
  violet: {
    header: 'border-violet-400/70 bg-violet-500/12 text-violet-100 shadow-[0_0_28px_rgba(167,139,250,0.24)]',
    line: 'before:bg-violet-300/60 after:border-violet-300/60',
    node: 'border-violet-400/65 bg-violet-500/8 text-violet-100',
    detail: 'border-violet-300/45 bg-violet-500/6 text-violet-100/90',
  },
  cyan: {
    header: 'border-cyan-400/70 bg-cyan-500/12 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.22)]',
    line: 'before:bg-cyan-300/60 after:border-cyan-300/60',
    node: 'border-cyan-400/65 bg-cyan-500/8 text-cyan-100',
    detail: 'border-cyan-300/45 bg-cyan-500/6 text-cyan-100/90',
  },
  lime: {
    header: 'border-lime-400/70 bg-lime-500/12 text-lime-100 shadow-[0_0_28px_rgba(163,230,53,0.2)]',
    line: 'before:bg-lime-300/60 after:border-lime-300/60',
    node: 'border-lime-400/65 bg-lime-500/8 text-lime-100',
    detail: 'border-lime-300/45 bg-lime-500/6 text-lime-100/90',
  },
  amber: {
    header: 'border-amber-400/70 bg-amber-500/12 text-amber-100 shadow-[0_0_28px_rgba(251,191,36,0.22)]',
    line: 'before:bg-amber-300/60 after:border-amber-300/60',
    node: 'border-amber-400/65 bg-amber-500/8 text-amber-100',
    detail: 'border-amber-300/45 bg-amber-500/6 text-amber-100/90',
  },
  pink: {
    header: 'border-pink-400/70 bg-pink-500/12 text-pink-100 shadow-[0_0_28px_rgba(244,114,182,0.22)]',
    line: 'before:bg-pink-300/60 after:border-pink-300/60',
    node: 'border-pink-400/65 bg-pink-500/8 text-pink-100',
    detail: 'border-pink-300/45 bg-pink-500/6 text-pink-100/90',
  },
};

const MINDMAPS: MindmapSection[] = [
  {
    title: 'Lý Luận Của C. Mác Về Giá Trị Thặng Dư',
    center: 'LÝ LUẬN CỦA C. MÁC VỀ GIÁ TRỊ THẶNG DƯ',
    minWidth: 'min-w-[1080px]',
    branches: [
      {
        title: 'a. Công thức chung của tư bản',
        tone: 'violet',
        nodes: [
          { title: 'Lưu thông hàng hóa (H - T - H)', details: ['Mua rẻ - bán đắt.'] },
          { title: 'Lưu thông tư bản (T - H - T\')', details: ['Ứng ra tiền mua TLSX và SLĐ, thu về nhiều tiền hơn.'] },
          { title: 'Giá trị thặng dư (t = T\' - T)', details: ['Phần chênh lệch lớn hơn là giá trị thặng dư.'] },
        ],
      },
      {
        title: 'b. Hàng hóa sức lao động',
        tone: 'cyan',
        nodes: [
          { title: 'Điều kiện trở thành hàng hóa', details: ['Sức lao động có thể thỏa mãn nhu cầu người khác và có thể mua bán.'] },
          { title: 'Thuộc tính giá trị', details: ['Do lao động xã hội cần thiết để tái sản xuất sức lao động.'] },
          { title: 'Thuộc tính giá trị sử dụng', details: ['Là khả năng lao động của con người khi tham gia sản xuất.'] },
        ],
      },
      {
        title: 'c. Sản xuất giá trị thặng dư',
        tone: 'lime',
        nodes: [
          { title: 'Thời gian lao động tất yếu', details: ['Tạo ra giá trị sức lao động (v).'] },
          { title: 'Thời gian lao động thặng dư', details: ['Tạo ra giá trị thặng dư (m).'] },
          { title: 'Bản chất', details: ['m là lao động không công bị nhà tư bản chiếm đoạt.'] },
        ],
      },
      {
        title: 'd. Tư bản bất biến và khả biến',
        tone: 'amber',
        nodes: [
          { title: 'Tư bản bất biến (c)', details: ['Tư liệu sản xuất; chỉ chuyển giá trị, không tạo giá trị mới.'] },
          { title: 'Tư bản khả biến (v)', details: ['Mua sức lao động; tạo ra giá trị mới (v + m).'] },
          { title: 'CÔNG THỨC GIÁ TRỊ HÀNG HÓA: G = c + (v + m)' },
        ],
      },
      {
        title: 'e. Tiền công, tuần hoàn và chu chuyển',
        tone: 'pink',
        nodes: [
          { title: 'Khái niệm tiền công', details: ['Giá cả của hàng hóa sức lao động.'] },
          { title: 'Bản chất', details: ['Công nhân tạo ra: v + m, nhưng chỉ nhận: v.'] },
          { title: 'Tuần hoàn tư bản', details: ['T - H - SX - H\' - T\' và T\' chứa giá trị thặng dư (m).'] },
          { title: 'Chu chuyển tư bản', details: ['n = số vòng chu chuyển / thời gian (thường là 1 năm).'] },
        ],
      },
    ],
  },
  {
    title: 'Bản Chất Của Giá Trị Thặng Dư (m)',
    center: 'BẢN CHẤT CỦA m',
    minWidth: 'min-w-[980px]',
    branches: [
      {
        title: 'Khái niệm cốt lõi',
        tone: 'violet',
        nodes: [
          { title: 'Giá trị mới dôi ra' },
          { title: 'Do công nhân tạo ra' },
          { title: 'Nhà tư bản chiếm lấy' },
          { title: 'Lao động không được trả công' },
        ],
      },
      {
        title: 'Bản chất xã hội',
        tone: 'cyan',
        nodes: [
          { title: 'Quan hệ giai cấp' },
          { title: 'Thuê mướn sức lao động' },
          { title: 'Tuân thủ quy luật giá trị' },
          { title: 'Khai thác giá trị lớn hơn' },
        ],
      },
    ],
  },
  {
    title: 'Các Phương Pháp Sản Xuất Giá Trị Thặng Dư',
    center: 'PHƯƠNG PHÁP TẠO m',
    minWidth: 'min-w-[980px]',
    branches: [
      {
        title: 'Phương pháp tuyệt đối',
        tone: 'violet',
        nodes: [
          { title: 'Kéo dài ngày lao động' },
          { title: 'Giữ nguyên thời gian lao động tất yếu' },
          { title: 'Tăng tỷ suất giá trị thặng dư (m\')' },
          { title: 'Giới hạn', details: ['Sức khỏe con người', 'Đấu tranh của công nhân'] },
        ],
      },
      {
        title: 'Phương pháp tương đối',
        tone: 'cyan',
        nodes: [
          { title: 'Rút ngắn thời gian lao động tất yếu' },
          { title: 'Giữ nguyên độ dài ngày lao động' },
          { title: 'Tăng năng suất lao động xã hội' },
          { title: 'Giảm giá trị hàng hóa sinh hoạt' },
        ],
      },
      {
        title: 'Giá trị thặng dư siêu ngạch',
        tone: 'lime',
        nodes: [
          { title: 'Áp dụng công nghệ mới sớm hơn' },
          { title: 'Giá trị cá biệt thấp hơn giá trị xã hội' },
          { title: 'Động lực thúc đẩy kỹ thuật' },
          { title: 'Dẫn đến giá trị thặng dư tương đối' },
        ],
      },
    ],
  },
];

function BranchCard({ branch }: { branch: Branch }) {
  const tone = toneStyles[branch.tone];

  return (
    <article className="rounded-2xl border border-white/12 bg-black/28 p-4">
      <div className={`rounded-xl border px-4 py-3 ${tone.header}`}>
        <h3 className="text-sm font-bold sm:text-base">{branch.title}</h3>
      </div>

      <div className="mt-3 border-l border-white/20 pl-3">
        <div className="space-y-2.5">
          {branch.nodes.map((node) => (
            <div key={node.title} className="relative pl-3 before:absolute before:left-0 before:top-3 before:h-px before:w-2 before:bg-white/25">
              <div className={`rounded-lg border px-3 py-2 text-sm leading-relaxed ${tone.node}`}>{node.title}</div>

              {node.details?.length ? (
                <ul className="mt-2 border-l border-white/20 pl-3 text-xs">
                  {node.details.map((detail) => (
                    <li
                      key={detail}
                      className={`relative mt-2 rounded-md border px-2.5 py-1.5 leading-relaxed before:absolute before:-left-3 before:top-1/2 before:h-px before:w-2 before:bg-white/25 ${tone.detail}`}
                    >
                      {detail}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function MindmapPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-10">
      <LandingSwitchNav />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="absolute right-4 top-1/3 h-72 w-72 rounded-full bg-cyan-500/12 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-lime-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-white/10 bg-black/30 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Mindmap</p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">Mindmap</h1>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/noi-dung"
              className="inline-flex rounded-xl border border-white/20 bg-white/6 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/12"
            >
              Quay lại trang nội dung cũ
            </Link>
          </div>
        </header>

        {MINDMAPS.map((map) => (
          <section key={map.title} className="rounded-3xl border border-white/10 bg-black/30 p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl font-black text-white sm:text-3xl">{map.title}</h2>

            <div className="mt-6 overflow-x-auto pb-2">
              <div className={`grid gap-5 lg:grid-cols-[260px_1fr] ${map.minWidth}`}>
                <aside className="lg:sticky lg:top-24 lg:h-fit">
                  <div className="rounded-2xl border border-mln-red/55 bg-mln-red/10 p-5 text-mln-cream shadow-[0_0_34px_rgba(239,68,68,0.2)]">
                    <p className="text-lg font-extrabold leading-snug">{map.center}</p>
                  </div>
                </aside>

                <div className="grid gap-4 xl:grid-cols-2">
                  {map.branches.map((branch) => (
                    <BranchCard key={branch.title} branch={branch} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
