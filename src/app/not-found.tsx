import Link from "next/link";
import { SearchCombobox } from "@/components/search/search-combobox";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex max-w-xl flex-col items-center py-24 text-center">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">We couldn’t find that page</h1>
      <p className="mt-3 text-muted-foreground">Try searching for the calculator you need.</p>
      <div className="mt-6 w-full text-left">
        <SearchCombobox location="page" />
      </div>
      <Link href="/calculators" className={buttonVariants({ variant: "outline", className: "mt-6" })}>
        Browse all calculators
      </Link>
    </Container>
  );
}
