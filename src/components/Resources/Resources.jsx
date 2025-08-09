
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import ResourceCard from './ResourceCard';
import { resources } from '../../data/resources';
import './Resources.css';

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...resources.map(cat => cat.category)];

  const filteredResources = resources.filter(category => {
    if (selectedCategory !== 'all' && category.category !== selectedCategory) {
      return false;
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return category.items.some(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  return (
    <div className="resources">
      <div className="container section-padding">
        <div className="resources-header">
          <h2 className="resources-title">Mental Health Resources</h2>
          <p className="resources-subtitle">
            Find support, information, and tools to help with your mental health journey.
          </p>
        </div>

        <div className="resources-controls">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-container">
            <Filter size={20} className="filter-icon" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredResources.length > 0 ? (
          filteredResources.map((category, index) => (
            <div key={index} className="resource-category">
              <h3 className="category-title">{category.category}</h3>
              <div className="resources-grid">
                {category.items
                  .filter(item => {
                    if (!searchTerm) return true;
                    const searchLower = searchTerm.toLowerCase();
                    return item.name.toLowerCase().includes(searchLower) ||
                      item.description.toLowerCase().includes(searchLower);
                  })
                  .map((item, itemIndex) => (
                    <ResourceCard key={itemIndex} resource={item} />
                  ))
                }
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No resources found matching your search criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="clear-filters-btn"
            >
              Clear Filters
            </button>
          </div>
        )}

        <div className="resources-info">
          <div className="info-card">
            <h4>How to Use These Resources</h4>
            <ul>
              <li>Start with crisis resources if you're in immediate danger</li>
              <li>Professional help resources can connect you with licensed therapists</li>
              <li>Self-help tools are great for daily mental health maintenance</li>
              <li>Educational resources provide valuable information about mental health</li>
            </ul>
          </div>

          <div className="info-card">
            <h4>When to Seek Professional Help</h4>
            <ul>
              <li>Symptoms interfere with daily life activities</li>
              <li>Feelings of hopelessness or thoughts of self-harm</li>
              <li>Difficulty managing emotions or relationships</li>
              <li>Substance use as a coping mechanism</li>
              <li>Persistent sleep or appetite changes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;