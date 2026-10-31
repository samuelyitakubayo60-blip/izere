import { useState, useEffect } from 'react';
import { getBlogPosts } from '../services/blogService';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedContent } from '../utils/contentText';

const Blog = () => {
  const { t, language } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'contraception', 'pregnancy', 'menstrual', 'sti'];

  useEffect(() => {
    setLoading(true);
    getBlogPosts(selectedCategory === 'all' ? null : selectedCategory, true)
      .then(setPosts)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('blog.title')}</h1>
        <p className="text-lg text-gray-600 mb-8">{t('blog.subtitle')}</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-100'
              }`}
            >
              {category === 'all' ? t('blog.all') : t(`categories.${category}`)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          </div>
        ) : posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {post.category && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                      {t(`categories.${post.category}`) || post.category}
                    </span>
                  )}
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">{post.title}</h2>
                  <p className="text-gray-600 line-clamp-3">{getLocalizedContent(post, language)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('blog.comingSoon')}</h2>
            <p className="text-gray-600">{t('blog.comingSoonText')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
