import random
from nba_api.stats.endpoints import leaguedashplayerstats
from nba_api.stats.endpoints import shotchartdetail

def generate_seasons(start_year=1996, end_year=2025):
    # Generates ["1996-97", "1997-98", ..., "2025-26"]
    return [f"{year}-{str(year + 1)[-2:]}" for year in range(start_year, end_year + 1)]

def get_random_starter_and_season():
    seasons = generate_seasons(1996, 2025)
    random_season = random.choice(seasons)
    
    # Fetch starters for that season
    stats = leaguedashplayerstats.LeagueDashPlayerStats(
        season=random_season,
        starter_bench_nullable="Starters"
    )
    df = stats.get_data_frames()[0]
    
    # Filter for players who started/played at least 25 games
    df = df[df["GP"] >= 25]
    
    random_player = df.sample(n=1).iloc[0]
    
    player_id = int(random_player["PLAYER_ID"])
    player_name = random_player["PLAYER_NAME"]
    team_abbr = random_player["TEAM_ABBREVIATION"]
    
    print(f"🎯 Hit! Player ID: {player_id}")
    print(f"📅 Random Season: {random_season} (Team: {team_abbr})")
    print(f"🏀 Player Name: {player_name}")
    
    return player_id, random_season, player_name

def get_shot_chart(player_id, season):
    # Query the ShotChartDetail endpoint
    # Note: team_id=0 fetches all shots across all teams if the player was traded mid-season
    shot_data = shotchartdetail.ShotChartDetail(
        team_id=0,
        player_id=player_id,
        season_nullable=season,
        context_measure_simple="FGA"  # 'FGA' captures both makes and misses
    )
    
    # Convert response into a pandas DataFrame
    df_shots = shot_data.get_data_frames()[0]
    
    print(f"Total shot attempts retrieved: {len(df_shots)}")
    
    # Inspect relevant coordinate and status columns
    if not df_shots.empty:
        print(df_shots[['PLAYER_NAME', 'GAME_ID', 'LOC_X', 'LOC_Y', 'SHOT_MADE_FLAG', 'SHOT_DISTANCE']].head())
        
    return df_shots

if __name__ == "__main__":
    player_id, season, player_name = get_random_starter_and_season()
    get_shot_chart(player_id, season)