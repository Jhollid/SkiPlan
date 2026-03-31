from textwrap import dedent

import httpx


def flims_laax_query() -> str:
    return dedent(
        """
        [out:json][timeout:90];
        (
          way["piste:type"](46.81,9.18,46.89,9.32);
          way["aerialway"](46.81,9.18,46.89,9.32);
          node["place"="village"](46.81,9.18,46.89,9.32);
        );
        (._;>;);
        out body;
        """
    ).strip()


async def fetch_overpass_payload(query: str) -> dict:
    async with httpx.AsyncClient(timeout=90.0) as client:
        response = await client.post("https://overpass-api.de/api/interpreter", content=query)
        response.raise_for_status()
        return response.json()
