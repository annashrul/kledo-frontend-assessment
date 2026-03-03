import { useLoaderData, useSearchParams } from "react-router-dom";

type Province = {
    id: number;
    name: string;
};

type Regency = {
    id: number;
    name: string;
    province_id: number;
};

type District = {
    id: number;
    name: string;
    regency_id: number;
};

type RegionData = {
    provinces: Province[];
    regencies: Regency[];
    districts: District[];
};

function parseId(value: string | null) {
    if (!value) return null;
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
}

function toSearchParams(params: URLSearchParams) {
    return new URLSearchParams(params.toString());
}

function formatBreadcrumb(parts: string[]) {
    if (parts.length === 0) return "Indonesia";
    return `Indonesia ${parts.join(" ")}`;
}

export default function FilterPage() {
    const { provinces, regencies, districts } = useLoaderData() as RegionData;
    const [searchParams, setSearchParams] = useSearchParams();

    const provinceId = parseId(searchParams.get("province"));
    const regencyId = parseId(searchParams.get("regency"));
    const districtId = parseId(searchParams.get("district"));

    const selectedProvince = provinces.find((item) => item.id === provinceId) ?? null;
    const availableRegencies = selectedProvince
        ? regencies.filter((item) => item.province_id === selectedProvince.id)
        : [];

    const selectedRegency = availableRegencies.find((item) => item.id === regencyId) ?? null;
    const availableDistricts = selectedRegency
        ? districts.filter((item) => item.regency_id === selectedRegency.id)
        : [];

    const selectedDistrict = availableDistricts.find((item) => item.id === districtId) ?? null;

    const breadcrumbParts: string[] = [];
    if (selectedProvince) breadcrumbParts.push("›", selectedProvince.name);
    if (selectedRegency) breadcrumbParts.push("›", selectedRegency.name);
    if (selectedDistrict) breadcrumbParts.push("›", selectedDistrict.name);

    const handleProvinceChange = (value: string) => {
        const nextParams = toSearchParams(searchParams);
        if (!value) {
            nextParams.delete("province");
            nextParams.delete("regency");
            nextParams.delete("district");
            setSearchParams(nextParams, { replace: true });
            return;
        }
        nextParams.set("province", value);
        nextParams.delete("regency");
        nextParams.delete("district");
        setSearchParams(nextParams, { replace: true });
    };

    const handleRegencyChange = (value: string) => {
        const nextParams = toSearchParams(searchParams);
        if (!value) {
            nextParams.delete("regency");
            nextParams.delete("district");
            setSearchParams(nextParams, { replace: true });
            return;
        }
        nextParams.set("regency", value);
        nextParams.delete("district");
        setSearchParams(nextParams, { replace: true });
    };

    const handleDistrictChange = (value: string) => {
        const nextParams = toSearchParams(searchParams);
        if (!value) {
            nextParams.delete("district");
            setSearchParams(nextParams, { replace: true });
            return;
        }
        nextParams.set("district", value);
        setSearchParams(nextParams, { replace: true });
    };

    const handleReset = () => {
        setSearchParams(new URLSearchParams(), { replace: true });
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="mx-auto flex min-h-screen max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:flex-row">
                <aside className="w-full border-b border-slate-100 px-6 py-8 md:w-72 md:border-b-0 md:border-r">
                    <div className="flex items-center gap-3 text-slate-700">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                            <span className="text-lg font-semibold">F</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Frontend Assessment</p>
                            <p className="text-xs text-slate-400">Filter Wilayah</p>
                        </div>
                    </div>

                    <div className="mt-10 space-y-6">
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                Provinsi
                            </label>
                            <div className="mt-2">
                                <select
                                    name="province"
                                    value={selectedProvince?.id ?? ""}
                                    onChange={(event) => handleProvinceChange(event.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                >
                                    <option value="">Pilih provinsi</option>
                                    {provinces.map((province) => (
                                        <option key={province.id} value={province.id}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                Kota/Kabupaten
                            </label>
                            <div className="mt-2">
                                <select
                                    name="regency"
                                    value={selectedRegency?.id ?? ""}
                                    onChange={(event) => handleRegencyChange(event.target.value)}
                                    disabled={!selectedProvince}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-50"
                                >
                                    <option value="">Pilih kota/kabupaten</option>
                                    {availableRegencies.map((regency) => (
                                        <option key={regency.id} value={regency.id}>
                                            {regency.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                Kecamatan
                            </label>
                            <div className="mt-2">
                                <select
                                    name="district"
                                    value={selectedDistrict?.id ?? ""}
                                    onChange={(event) => handleDistrictChange(event.target.value)}
                                    disabled={!selectedRegency}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-50"
                                >
                                    <option value="">Pilih kecamatan</option>
                                    {availableDistricts.map((district) => (
                                        <option key={district.id} value={district.id}>
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleReset}
                        className="mt-10 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-500 bg-white px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                    >
                        Reset
                    </button>
                </aside>

                <div className="flex-1 px-6 py-8 md:px-12">
                    <nav className="breadcrumb text-sm text-slate-400">
                        {formatBreadcrumb(breadcrumbParts)}
                    </nav>

                    <main className="mt-10 flex flex-col items-center gap-10 text-center">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                Provinsi
                            </p>
                            <p className="text-4xl font-semibold text-slate-800 md:text-5xl">
                                {selectedProvince?.name ?? "Pilih provinsi"}
                            </p>
                        </div>

                        <div className="text-slate-300">↓</div>

                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                Kota / Kabupaten
                            </p>
                            <p className="text-3xl font-semibold text-slate-800 md:text-4xl">
                                {selectedRegency?.name ?? "Pilih kota/kabupaten"}
                            </p>
                        </div>

                        <div className="text-slate-300">↓</div>

                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                Kecamatan
                            </p>
                            <p className="text-3xl font-semibold text-slate-800 md:text-4xl">
                                {selectedDistrict?.name ?? "Pilih kecamatan"}
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
