import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, User, Clock, ArrowRight, Search, Tag } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const blogPosts = [
  {
    id: 1,
    title: "The Future of Supply Chain Management: Trends to Watch in 2024",
    excerpt: "Explore the latest innovations shaping the logistics industry, from AI-powered forecasting to sustainable transportation solutions.",
    author: "Sarah Johnson",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Industry Trends",
    tags: ["Supply Chain", "AI", "Innovation"],
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20supply%20chain%20technology%2C%20AI%20and%20automation%20in%20logistics%2C%20digital%20transformation%2C%20professional%20business%20technology%2C%20clean%20modern%20design&image_size=landscape_4_3",
    featured: true
  },
  {
    id: 2,
    title: "Green Logistics: How Sustainable Practices Are Reshaping Transportation",
    excerpt: "Learn how companies are reducing their carbon footprint while maintaining efficiency in their logistics operations.",
    author: "Michael Chen",
    date: "2024-01-10",
    readTime: "7 min read",
    category: "Sustainability",
    tags: ["Green Logistics", "Sustainability", "Environment"],
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Sustainable%20logistics%20and%20green%20transportation%2C%20eco-friendly%20delivery%20vehicles%2C%20renewable%20energy%20in%20warehouses%2C%20environmental%20consciousness%2C%20clean%20modern%20design&image_size=landscape_4_3",
    featured: false
  },
  {
    id: 3,
    title: "Ocean Freight vs Air Freight: Choosing the Right Shipping Method",
    excerpt: "A comprehensive guide to help businesses make informed decisions about international shipping options based on cost, speed, and cargo type.",
    author: "David Rodriguez",
    date: "2024-01-05",
    readTime: "6 min read",
    category: "Shipping Guide",
    tags: ["Ocean Freight", "Air Freight", "International Shipping"],
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Cargo%20ship%20and%20airplane%20comparison%2C%20international%20shipping%20methods%2C%20freight%20transportation%20options%2C%20professional%20logistics%20visualization%2C%20clean%20modern%20design&image_size=landscape_4_3",
    featured: false
  },
  {
    id: 4,
    title: "Warehouse Automation: Boosting Efficiency in Modern Logistics",
    excerpt: "Discover how automated systems are revolutionizing warehouse operations and improving inventory management accuracy.",
    author: "Emily Wang",
    date: "2023-12-28",
    readTime: "8 min read",
    category: "Technology",
    tags: ["Warehouse", "Automation", "Technology"],
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Automated%20warehouse%20with%20robots%20and%20conveyor%20systems%2C%20modern%20logistics%20technology%2C%20inventory%20management%20systems%2C%20professional%20industrial%20automation%2C%20clean%20modern%20design&image_size=landscape_4_3",
    featured: false
  },
  {
    id: 5,
    title: "The Impact of E-commerce on Last-Mile Delivery Solutions",
    excerpt: "Understanding the challenges and innovations in last-mile delivery driven by the e-commerce boom.",
    author: "James Thompson",
    date: "2023-12-20",
    readTime: "4 min read",
    category: "E-commerce",
    tags: ["E-commerce", "Last Mile", "Delivery"],
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=E-commerce%20delivery%20and%20last-mile%20logistics%2C%20package%20delivery%20to%20homes%2C%20online%20shopping%20fulfillment%2C%20professional%20delivery%20services%2C%20clean%20modern%20design&image_size=landscape_4_3",
    featured: false
  },
  {
    id: 6,
    title: "Risk Management in Global Supply Chains: Best Practices for 2024",
    excerpt: "Essential strategies for identifying and mitigating risks in international supply chain operations.",
    author: "Lisa Anderson",
    date: "2023-12-15",
    readTime: "9 min read",
    category: "Risk Management",
    tags: ["Risk Management", "Global Supply Chain", "Best Practices"],
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Global%20supply%20chain%20risk%20management%2C%20international%20business%20strategy%2C%20professional%20risk%20assessment%2C%20worldwide%20logistics%20network%2C%20clean%20modern%20design&image_size=landscape_4_3",
    featured: false
  }
];

const categories = ["All", "Industry Trends", "Sustainability", "Shipping Guide", "Technology", "E-commerce", "Risk Management"];
const allTags = ["Supply Chain", "AI", "Innovation", "Green Logistics", "Sustainability", "Environment", "Ocean Freight", "Air Freight", "International Shipping", "Warehouse", "Automation", "Technology", "E-commerce", "Last Mile", "Delivery", "Risk Management", "Global Supply Chain", "Best Practices"];

export default function Blog() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">{t('blog.title')}</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">{t('blog.sub')}</p>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-full">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {t('blog.featured')}
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-12">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {featuredPost.category}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{featuredPost.readTime}</span>
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{featuredPost.author}</span>
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{featuredPost.date}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1">
                      <span>{t('blog.read_more')}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('blog.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'All' ? t('blog.all') : category}
                </button>
              ))}
            </div>
            
            {/* Tag Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 font-medium">{t('blog.popular_tags')}</span>
              <button
                onClick={() => setSelectedTag('')}
                className={`px-3 py-1 rounded-full text-xs transition-colors duration-200 ${
                  !selectedTag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t('blog.all')}
              </button>
              {allTags.slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors duration-200 ${
                    selectedTag === tag
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </span>
                    </div>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 w-full justify-center">
                      <span>Read Article</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('blog.no_articles')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('blog.newsletter_title')}</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">{t('blog.newsletter_sub')}</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder={t('blog.email_placeholder')}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              {t('blog.subscribe')}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
