import './CategoryGrid.css';

const CategoryGrid = () => {
  const categories = [
    {
      id: 1,
      name: 'Apartment',
      count: 17,
      image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'
    },
    {
      id: 2,
      name: 'Office',
      count: 3,
      image: 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg'
    },
    {
      id: 3,
      name: 'Studio',
      count: 7,
      image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg'
    },
    {
      id: 4,
      name: 'Single Family Home',
      count: 10,
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'
    },
    {
      id: 5,
      name: 'Shop',
      count: 3,
      image: 'https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg'
    },
    {
      id: 6,
      name: 'Villa',
      count: 10,
      image: 'https://images.pexels.com/photos/53610/large-home-residential-house-architecture-53610.jpeg'
    }
  ];

  return (
    <section className="category-section">
      <div className="container">
        <div className="section-header">
          <h2>You Can Design Clean And Modern Grid Layouts</h2>
          <p>Grids are the backbone of all layouts, infographics and presentations</p>
        </div>
        
        <div className="category-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-image">
                <img src={category.image} alt={category.name} />
                <div className="category-overlay">
                  <span className="property-count">{category.count} Properties</span>
                  <h3>{category.name}</h3>
                  <a href="#" className="category-link">
                    MORE DETAILS
                    <span className="arrow-icon">→</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;