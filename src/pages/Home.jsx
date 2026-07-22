import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useChatUI } from '../components/FloatingChat';

const Home = () => {
  const { t } = useLanguage();
  const { openChat } = useChatUI();

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-pink-50">
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">IZERE</h1>
          <p className="text-lg md:text-xl opacity-90 mb-1">{t('home.tagline')}</p>
          <p className="text-xl md:text-2xl mb-2">{t('home.headline')}</p>
          <p className="text-lg md:text-xl opacity-90 mb-8">{t('home.subheadline')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={openChat}
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
            >
              {t('home.startChatting')}
            </button>
            <Link
              to="/contraception"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
            >
              {t('home.learnMore')}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('home.missionTitle')}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('home.missionText')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            ['💬', 'featureChatTitle', 'featureChatText'],
            ['🔒', 'featurePrivateTitle', 'featurePrivateText'],
            ['🌍', 'featureLangTitle', 'featureLangText'],
            ['✅', 'featureTrustedTitle', 'featureTrustedText'],
          ].map(([icon, titleKey, textKey]) => (
            <div key={titleKey} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-red-600 text-4xl mb-4">{icon}</div>
              <h3 className="text-xl font-semibold mb-2">{t(`home.${titleKey}`)}</h3>
              <p className="text-gray-600">{t(`home.${textKey}`)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{t('home.topicsTitle')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              ['/contraception', 'topicContraception', 'topicContraceptionDesc', 'from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'],
              ['/pregnancy', 'topicPregnancy', 'topicPregnancyDesc', 'from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'],
              ['/menstrual', 'topicMenstrual', 'topicMenstrualDesc', 'from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'],
              ['/sti', 'topicSti', 'topicStiDesc', 'from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600'],
            ].map(([path, titleKey, descKey, gradient]) => (
              <Link
                key={path}
                to={path}
                className={`bg-gradient-to-br ${gradient} text-white p-6 rounded-lg transition-all`}
              >
                <h3 className="text-xl font-semibold mb-2">{t(`home.${titleKey}`)}</h3>
                <p className="opacity-90">{t(`home.${descKey}`)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
          <h3 className="text-lg font-semibold text-yellow-800">{t('home.noticeTitle')}</h3>
          <p className="text-yellow-700 mt-2">{t('home.noticeText')}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
