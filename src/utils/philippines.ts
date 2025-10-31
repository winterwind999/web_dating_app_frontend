import citiesData from "philippines/cities";
import provincesData from "philippines/provinces";

type Province = {
  name: string;
  region: string;
  key: string;
};

type City = {
  name: string;
  province: string;
  city?: boolean;
};

export async function getProvinces(): Promise<
  { province_name: string; province_key: string }[]
> {
  return provincesData.map((p: Province) => ({
    province_name: p.name,
    province_key: p.key,
  }));
}

export async function getCitiesByProvince(
  provinceName: string,
): Promise<{ city_name: string; city_key: string }[]> {
  const province = provincesData.find((p: Province) => p.name === provinceName);
  if (!province) return [];

  const filteredCities = citiesData.filter(
    (c: City) => c.province === province.key,
  );

  return filteredCities.map((c: City) => ({
    city_name: c.name,
    city_key: `${province.key}-${c.name}`,
  }));
}
