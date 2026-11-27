import Image from "next/image";
import Link from "next/link";
import { formatDate, readingMinutes, type Post } from "@/lib/blog";

// Card de post usado na lista do blog, nos relacionados e na Home.
export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-profundo/10 transition-shadow hover:shadow-[0_24px_60px_-30px_rgba(18,23,68,0.45)] ${
        featured ? "lg:grid lg:grid-cols-[1.3fr_1fr]" : ""
      }`}
    >
      <div className={`relative overflow-hidden bg-profundo ${featured ? "aspect-[16/9] lg:aspect-auto lg:min-h-80" : "aspect-[16/9]"}`}>
        {post.cover && (
          <Image
            src={post.cover}
            alt=""
            fill
            sizes={featured ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </div>
      <div className={`flex flex-1 flex-col ${featured ? "p-8 md:p-10 lg:justify-center" : "p-6"}`}>
        <p className="text-sm font-semibold text-royal">{post.category}</p>
        <h3
          className={`mt-2 font-bold leading-snug tracking-[-0.01em] text-profundo group-hover:text-royal ${
            featured ? "text-2xl md:text-3xl" : "text-lg"
          }`}
        >
          {post.title}
        </h3>
        <p className={`mt-3 flex-1 leading-relaxed text-marinho/65 ${featured ? "" : "line-clamp-3 text-[15px]"}`}>{post.excerpt}</p>
        <p className="mt-5 flex items-center gap-2 text-sm text-marinho/50">
          <span className="icon text-lg!">schedule</span>
          {formatDate(post.publishedAt)}, {readingMinutes(post.body)} min de leitura
        </p>
      </div>
    </Link>
  );
}
