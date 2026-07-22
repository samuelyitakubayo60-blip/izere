import { useState, useEffect } from 'react';
import { getContentByCategory } from '../services/contentService';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedContent } from '../utils/contentText';

const TopicPage = ({ category, topicKey, accentClass = 'border-red-600' }) => {
  const { t, language } = useLanguage();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getContentByCategory(category)
      .then(setContents)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{t(`topics.${topicKey}.title`)}</h1>
        <p className="text-lg text-gray-600 mb-8">{t(`topics.${topicKey}.subtitle`)}</p>

        {loading ? (
          <div className="text-center py-20">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${accentClass} mx-auto`} />
            <p className="mt-4 text-gray-500">{t('common.loading')}</p>
          </div>
        ) : contents.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {contents.map((content) => (
              <div key={content.id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{content.title}</h2>
                <div className="prose max-w-none text-gray-600">
                  <p>{getLocalizedContent(content, language)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
            {t('blog.comingSoonText')}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicPage;
