import { CheerioAPI } from "cheerio";
import { logAccent, logTitle } from "../../common/Logger";
import * as PageService from "../page/page.service";
import Table from "../table/table.interface";
import * as TableService from "../table/table.service";
import TournamentDate from "../tournament-date/tournament-date.interface";
import * as TournamentDateService from "../tournament-date/tournament-date.service";
import * as TournamentInfoService from "../tournament-info/tournament-info.service";
import Tournament from "./tournament.interface";

const getName = (query: string): string => query.replace(/_/g, " ");

const scrapTournament = (query: string, $: CheerioAPI) => {
    logAccent(`||||||||||||||||||||||||||||||||||||||||||||||`);
    logTitle(`Retriving tournament: ${query}`);
    const dates: TournamentDate[] = TournamentDateService.getAllDates(query, $);
    const table: Table = TableService.getTable(query, $);
    const info = TournamentInfoService.getInfo(query, $);
    logAccent(`||||||||||||||||||||||||||||||||||||||||||||||`);
    return {
        name: getName(query),
        info,
        table,
        dates,
    };
}

export const getTournament = async (query: string): Promise<Tournament> => {
    const $ = await PageService.getPage(query);
    return scrapTournament(query, $);
};

export const getTournaments = async (queries: string[]): Promise<Tournament[]> => {
    const tournaments = await Promise.all(queries.map(getTournament));
    return tournaments;
};