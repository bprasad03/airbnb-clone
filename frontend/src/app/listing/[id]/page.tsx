import { notFound } from "next/navigation";
import { getListingDetail } from "@/lib/detailMockData";
import ListingDetailView from "@/components/ListingDetailView";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  const detail = getListingDetail(id);

  if (!detail) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <ListingDetailView detail={detail} />
    </div>
  );
}
