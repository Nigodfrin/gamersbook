import { Game } from "./Game";

export class ResultsJSONP {
    error: string;
    limit: number;
    offset: number;
    number_of_page_results: number;
    number_of_total_results: number;
    status_code: number;
    results: Game[];
    version: string;


    constructor(data) {
        this.error = data.error,
        this.limit = data.limit,
        this.offset = data.offset,
        this.number_of_page_results = data.number_of_page_results,
        this.number_of_total_results = data.number_of_total_results,
        this.status_code = data.status_code,
        this.results = data.results,
        this.version = data.version
    }
}