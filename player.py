import random
from nba_api.stats.endpoints import leaguedashplayerstats, shotchartdetail, playerdashboardbyyearoveryear

def generate_seasons(start_year=1996, end_year=2025):
    return [f"{year}-{str(year + 1)[-2:]}" for year in range(start_year, end_year + 1)]

def get_random_starter_and_season():
    seasons = generate_seasons(1996, 2025)
    random_season = random.choice(seasons)
    
    stats = leaguedashplayerstats.LeagueDashPlayerStats(
        season=random_season,
        starter_bench_nullable="Starters"
    )
    df = stats.get_data_frames()[0]
    
    df = df[df["GP"] >= 50]
    
    random_player = df.sample(n=1).iloc[0]
    
    player_id = int(random_player["PLAYER_ID"])
    player_name = random_player["PLAYER_NAME"]
    team_abbr = random_player["TEAM_ABBREVIATION"]
    
    print(f"🎯 Hit! Player ID: {player_id}")
    print(f"📅 Random Season: {random_season} (Team: {team_abbr})")
    print(f"🏀 Player Name: {player_name}")
    
    return player_id, random_season, player_name

def get_shot_chart(player_id, season):
    shot_data = shotchartdetail.ShotChartDetail(
        team_id=0,
        player_id=player_id,
        season_nullable=season,
        context_measure_simple="FGA"
    )

    cols = ['ACTION_TYPE', 'LOC_X', 'LOC_Y', 'SHOT_MADE_FLAG', 'SHOT_DISTANCE', 'SHOT_ZONE_BASIC', 'SHOT_ZONE_RANGE', 'SHOT_TYPE']
    df_shots = shot_data.get_data_frames()[0][cols]

    # Inspect relevant coordinate and status columns
    if not df_shots.empty:
        print(df_shots[['ACTION_TYPE', 'LOC_X', 'LOC_Y', 'SHOT_MADE_FLAG', 'SHOT_DISTANCE', 'SHOT_ZONE_BASIC', 'SHOT_ZONE_RANGE', 'SHOT_TYPE']].head())

    player_stats_average = playerdashboardbyyearoveryear.PlayerDashboardByYearOverYear(
        season=season,
        player_id=player_id,
        per_mode_detailed= "PerGame" 
    )

    cols = ['GROUP_VALUE', 'PTS', 'AST', 'REB', 'FG_PCT', 'FG3_PCT', 'STL', 'BLK', 'TOV', 'MIN', 'FG3A', 'FGA', 'FT_PCT']
    df_player_stats_average = (
        player_stats_average.overall_player_dashboard.get_data_frame()[cols]
        .rename(columns={
            "GROUP_VALUE": "SEASON", 
            "FGA": "FG2A"
            })
    )

    if not df_player_stats_average.empty:
        df_player_stats_average['FG2A'] = df_player_stats_average['FG2A'] - df_player_stats_average['FG3A']
        print(f"Player stats for {df_player_stats_average.iloc[0]['SEASON']}:")
        print(df_player_stats_average.head())
    
    return df_shots, df_player_stats_average

if __name__ == "__main__":
    player_id, season, player_name = get_random_starter_and_season()
    get_shot_chart(player_id, season)