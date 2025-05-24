import HorListingCarousel from "./HorListingCarousel";
import heroBg from "../../assets/download.jpg";
export default function HorizontalListing({listings}) {
    return (
      <div className="main_horizontal_listing">
        <div className="text_content">
          <h1>Discover Top Properties & Fresh Listings</h1>
          <p>
            Turn your attention to the most desirable and profitable properties,
            <br className="remove_br" />
            updated regularly to keep you ahead in your real estate journey.
          </p>
        </div>
        <div className="hor_listings">
          <HorListingCarousel listings={listings}></HorListingCarousel>
        </div>
        <div
          className="hero-container-tint"
          style={{
            background: `url(${heroBg}) center/cover no-repeat fixed`,
          }}
        >
          <div className="hero-overlay-tint"></div> {/* Blue tint */}
          <div className="hero-content-tint">
            <p className="hero-text-tint p">
              Discover the best plots and apartments for sale or rent. Expert
              guidance, transparent deals, and a seamless experience-your
              trusted partner in real estate.{" "}
            </p>
            <div className="features_main hor-main">
              <div className="features">
                <p className="title hor-title">LOOKING TO BUY</p>
                <p>
                  Find premium plots and modern apartments for sale in top
                  locations.
                </p>
              </div>
              <div className="features">
                <p className="title">SELL YOUR PROPERTY</p>
                <p>
                  List your plot or apartment with us for a fast, secure sale.
                </p>
              </div>
              <div className="features">
                <p className="title">RENT A PLACE</p>
                <p>
                  Browse a curated selection of apartments available for rent.
                </p>
              </div>
              <div className="features">
                <p className="title">NEED HELP?</p>
                <p>
                  Get expert advice and personalized assistance from our real
                  estate specialists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}