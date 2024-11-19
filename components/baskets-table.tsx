"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useBaskets } from "@/hooks/use-baskets";
import { Basket } from "@/lib/types";
import SkeletonTable from "./skeleton-table";
import PriceChange from "@/components/percentage-price-change";
import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { TokenIcon } from "./token-icon";
import { useRouter } from "next/navigation";

type SortField =
    | "name"
    | "currentPrice"
    | "price1hChange"
    | "price4hChange"
    | "price24hChange";
type SortDirection = "asc" | "desc";

export default function BasketsTable() {
    const { baskets, loading, error } = useBaskets();
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const router = useRouter();

    if (loading) return <SkeletonTable columns={5} />;
    if (error) return <p>Error: {error}</p>;

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            // Toggle sort direction
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            // Set new sort field and default direction
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const sortedBaskets = [...baskets].sort((a, b) => {
        const valueA = a[sortField];
        const valueB = b[sortField];

        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    const renderSortIndicator = (field: SortField) => {
        return (
            <span className="inline-flex items-center w-4 h-4 ml-2">
                {sortField === field &&
                    (sortDirection === "asc" ? (
                        <ArrowUp className="w-4 h-4" />
                    ) : (
                        <ArrowDown className="w-4 h-4" />
                    ))}
            </span>
        );
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead
                        onClick={() => handleSort("name")}
                        className="cursor-pointer"
                    >
                        Basket Name {renderSortIndicator("name")}
                    </TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead
                        onClick={() => handleSort("currentPrice")}
                        className="cursor-pointer"
                    >
                        Price {renderSortIndicator("currentPrice")}
                    </TableHead>
                    <TableHead
                        onClick={() => handleSort("price1hChange")}
                        className="cursor-pointer"
                    >
                        1H Change {renderSortIndicator("price1hChange")}
                    </TableHead>
                    <TableHead
                        onClick={() => handleSort("price4hChange")}
                        className="cursor-pointer"
                    >
                        4H Change {renderSortIndicator("price4hChange")}
                    </TableHead>
                    <TableHead
                        onClick={() => handleSort("price24hChange")}
                        className="cursor-pointer"
                    >
                        24H Change {renderSortIndicator("price24hChange")}
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedBaskets.map((basket: Basket) => (
                    <TableRow
                        key={basket.id}
                        onClick={() => router.push(`/baskets/${basket.id}`)}
                        className="cursor-pointer"
                    >
                        <TableCell>{basket.name}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-1">
                                {basket.tokens.slice(0, 3).map((token) => (
                                    <TokenIcon
                                        key={token.symbol}
                                        token={token}
                                        size="small"
                                    />
                                ))}
                                {basket.tokens.length > 3 && (
                                    <span className="text-muted-foreground">
                                        ...
                                    </span>
                                )}
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            ${basket.currentPrice.toFixed(4)}
                        </TableCell>
                        <TableCell className="text-right">
                            <PriceChange change={basket.price1hChange} />
                        </TableCell>
                        <TableCell className="text-right">
                            <PriceChange change={basket.price4hChange} />
                        </TableCell>
                        <TableCell className="text-right">
                            <PriceChange change={basket.price24hChange} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
