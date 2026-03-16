import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-3">VegMap</h3>
            <p className="text-sm text-muted-foreground">
              Find vegetarian restaurants in Taipei with English menus and
              reviews.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Map
                </Link>
              </li>
              <li>
                <Link href="/restaurants" className="hover:text-foreground">
                  All Restaurants
                </Link>
              </li>
              <li>
                <Link href="/restaurants/suggest" className="hover:text-foreground">
                  Suggest a Restaurant
                </Link>
              </li>
              <li>
                <Link href="/night-markets" className="hover:text-foreground">
                  Night Market Guide
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Veg Types</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Vegan</li>
              <li>Ovo-Lacto Vegetarian</li>
              <li>Five Allium Free</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">About</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  About VegMap
                </Link>
              </li>
              <li>
                <Link href="/tools/diet-card" className="hover:text-foreground">
                  Diet Communication Card
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} VegMap. Helping foreigners find
          vegetarian food in Taiwan.
        </div>
      </div>
    </footer>
  );
}
