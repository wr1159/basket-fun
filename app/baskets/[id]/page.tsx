"use client";

import { useParams } from "next/navigation";
import { useBaskets } from "@/hooks/use-baskets";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import BasketPriceChart from "@/components/basket-price-chart";
import { TokenIcon } from "@/components/token-icon";
import { JupiterBasketSwap } from "@/components/solana/swap-basket-tokens";

export default function BasketDetails() {
    const params = useParams();
    const { getBasketById } = useBaskets();
    const basket = getBasketById(params.id as string);
    const [priceData, setPriceData] = useState<
        { time: string; value: number }[]
    >([]);

    useEffect(() => {
        const fetchBasketPrices = async () => {
            const response = await fetch(
                `/api/baskets/price?basketId=${params.id}`
            );
            const data = await response.json();
            const formattedData = data.map(
                (entry: { timestamp: string; price: number }) => ({
                    time: entry.timestamp,
                    value: entry.price,
                })
            );
            setPriceData(formattedData);
        };

        fetchBasketPrices();
    }, [params.id]);

    if (!basket) {
        return <Skeleton className="container py-10 w-[80vw] max-w-2xl h-96" />;
    }

    return (
        <div className="container mx-auto py-10">
            <Button asChild className="mb-4">
                <Link href="/baskets">Back to Baskets</Link>
            </Button>
            <JupiterBasketSwap basket={basket} />
            <BasketPriceChart priceData={priceData} name={basket.name} />
            <Card className="max-w-[80vw] sm:max-w-none">
                <CardHeader>
                    <CardTitle>{basket.name}</CardTitle>
                    <CardDescription>
                        Rebalance Interval: {basket.rebalanceInterval} days
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <h3 className="text-lg font-semibold mb-2">Tokens</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Token</TableHead>
                                <TableHead>Address</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {basket.tokens.map((token, index) => (
                                <TableRow key={index}>
                                    <TableCell className="flex items-center gap-x-2">
                                        <TokenIcon token={token} />
                                        {token.symbol}{" "}
                                        <span className="text-stone-500">
                                            ({token.name})
                                        </span>
                                    </TableCell>
                                    <TableCell>{token.address}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
