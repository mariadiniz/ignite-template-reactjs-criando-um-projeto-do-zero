import { GetStaticProps } from 'next';

import Prismic from '@prismicio/client';

import Head from 'next/head';

import { useState } from 'react';
import Link from 'next/link';
import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import styles from './home.module.scss';
import Header from '../components/Header';
import commonStyles from '../styles/common.module.scss';
import { getPrismicClient } from '../services/prismic';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview: any;
}

const Home: React.FC<HomeProps> = ({ postsPagination, preview }) => {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  const handleMorePosts = async (): Promise<void> => {
    const postsResponse = await fetch(nextPage).then(response =>
      response.json()
    );

    const formattedPosts = postsResponse.results.map((post): Post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setNextPage(postsResponse.next_page);
    setPosts(old => [...old, ...formattedPosts]);
  };

  const formattedPostDate = (date: string): string => {
    const formattedDate = format(new Date(date), 'dd MMM yyyy', {
      locale: ptBR,
    });
    return formattedDate;
  };

  return (
    <>
      <Head>
        <title>Home | Spacetraveling</title>
      </Head>

      <Header />

      <main className={`${commonStyles.container} ${styles.homeContainer}`}>
        <ul className={styles.posts}>
          {posts.map(post => (
            <li key={post.uid} className={styles.post}>
              <Link href={`/post/${post.uid}`}>
                <a>
                  <h2>{post.data.title}</h2>
                  <p>{post.data.subtitle}</p>
                  <div className={commonStyles.infos}>
                    <span>
                      <img src="/images/calendar.png" alt="calendar" />
                      {formattedPostDate(post.first_publication_date)}
                    </span>
                    <span>
                      <img src="/images/author.png" alt="author" />
                      {post.data.author}
                    </span>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
        {nextPage && (
          <span
            aria-hidden="true"
            onClick={handleMorePosts}
            className={styles.loadMore}
          >
            Carregar mais posts
          </span>
        )}
        {preview && (
          <aside>
            <Link href="/api/exit-preview">
              <a>Sair do modo Preview</a>
            </Link>
          </aside>
        )}
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author', 'post.content'],
      pageSize: 2,
      ref: previewData?.ref ?? null,
    }
  );

  const posts = postsResponse.results.map((post): Post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  console.log(posts);

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
      preview,
    },
  };
};

export default Home;
