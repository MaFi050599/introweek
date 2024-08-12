import fs from 'fs';
import csv from 'csv-parser';

export async function readCSVFile(filePath: string): Promise<object[]> {
    const results: object[] = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .setEncoding("utf-8")
            .pipe(csv())
            .on("data", (data) => {
                // Clean each field in the data
                const cleanedData = Object.fromEntries(
                    Object.entries(data).map(([key, value]) => [
                        key.trim(),
                        typeof value === 'string' ? cleanString(value) : value,
                    ])
                );
                results.push(cleanedData);
            })
            .on("end", () => resolve(results))
            .on("error", error => reject(error));
    });
}

const cleanString = (str: string) => {
    return str.replace(/^\uFEFF/, '').trim(); // Remove BOM and trim spaces
};
