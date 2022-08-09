import { Product } from '../../models/discover/Product';
import Products from './Products';

type RightColumnProps = {
  products: Product[];
  loading: boolean;
  selectedKeyword: string;
};

const RightColumn = (props: RightColumnProps): JSX.Element => {
  const { products, loading, selectedKeyword } = props;

  return window.RFK.ui.html`
    <div class="right-section">
      ${
        selectedKeyword && selectedKeyword !== ''
          ? window.RFK.ui
              .html`<h2 class="right-section-title">Top results for "${selectedKeyword}"</h2>`
          : window.RFK.ui.html`<h2 class="right-section-title">Top results</h2>`
      }
      <a href="#" class="view-all-link">View all</a>
      ${!loading && window.RFK.ui.html`<${Products} products=${products} loading=${loading} />`}
      ${loading && window.RFK.ui.html`loading .....`}
    </div>
  `;
};

export default RightColumn;
