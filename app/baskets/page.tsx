import { Suspense } from "react";
import CreateBasketDialog from "@/components/create-baskets-dialog";
import BasketsTable from "@/components/baskets-table";
import SkeletonTable from "@/components/skeleton-table";

export default function Home() {
    return (
        <div className="mx-auto py-10">
            <h1 className="text-4xl font-bold mb-8">BasketFi</h1>
            <div className="mb-4">
                <CreateBasketDialog />
            </div>
            <Suspense fallback={<SkeletonTable columns={6} />}>
                <BasketsTable />
            </Suspense>
        </div>
    );
}
