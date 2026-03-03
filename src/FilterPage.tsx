import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
interface Province {
    id: number;
    name: string;
}

interface Regency extends Province {
    province_id: number;
}

interface District extends Province {
    regency_id: number;
}

interface RegionLoaderData {
    provinces: Province[];
    regencies: Regency[];
    districts: District[];
}

type RegionFilterKey = "province" | "regency" | "district";

const CASCADE_KEYS: Record<RegionFilterKey, RegionFilterKey[]> = {
    province: ["province", "regency", "district"],
    regency: ["regency", "district"],
    district: ["district"],
};

function parseIntOrNull(value: string | null): number | null {
    const parsed = Number.parseInt(value ?? "", 10);
    return Number.isNaN(parsed) ? null : parsed;
}

function buildBreadcrumb(...segments: (string | undefined)[]): string {
    return ["Indonesia", ...segments].filter(Boolean).join(" › ");
}

interface RegionSelectProps {
    label: string;
    name: RegionFilterKey;
    value: string;
    options: Province[];
    disabled?: boolean;
    onChange: (value: string) => void;
}

function RegionSelect({ label, name, value, options, disabled = false, onChange }: RegionSelectProps) {
    return (
        <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {label}
            </label>
            <select
                name={name}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
                <option value="">Pilih {label.toLowerCase()}</option>
                {options.map(({ id, name: optionName }) => (
                    <option key={id} value={id}>{optionName}</option>
                ))}
            </select>
        </div>
    );
}

interface RegionLabelProps {
    label: string;
    value?: string;
    size?: "lg" | "xl";
}

function RegionLabel({ label, value, size = "lg" }: RegionLabelProps) {
    const textSize = size === "xl" ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl";
    return (
        <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
            <p className={`${textSize} font-semibold text-slate-800`}>
                {value ?? `Pilih ${label.toLowerCase()}`}
            </p>
        </div>
    );
}

function useRegionFilter(provinces: Province[], regencies: Regency[], districts: District[]) {
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedProvinceId = parseIntOrNull(searchParams.get("province"));
    const selectedRegencyId = parseIntOrNull(searchParams.get("regency"));
    const selectedDistrictId = parseIntOrNull(searchParams.get("district"));

    const selectedProvince = provinces.find((p) => p.id === selectedProvinceId) ?? null;
    const selectedRegency = regencies.find((r) => r.id === selectedRegencyId && r.province_id === selectedProvince?.id) ?? null;
    const selectedDistrict = districts.find((d) => d.id === selectedDistrictId && d.regency_id === selectedRegency?.id) ?? null;

    const availableRegencies = regencies.filter((r) => r.province_id === selectedProvince?.id);
    const availableDistricts = districts.filter((d) => d.regency_id === selectedRegency?.id);

    const updateFilter = (key: RegionFilterKey, value: string) => {
        const nextParams = new URLSearchParams(searchParams.toString());
        CASCADE_KEYS[key].forEach((k) => nextParams.delete(k));
        if (value) nextParams.set(key, value);
        setSearchParams(nextParams, { replace: true });
    };

    const resetFilter = () => setSearchParams(new URLSearchParams(), { replace: true });

    const isDirty = !!(selectedProvince || selectedRegency || selectedDistrict);

    return {
        searchParams,
        selectedProvince,
        selectedRegency,
        selectedDistrict,
        availableRegencies,
        availableDistricts,
        updateFilter,
        resetFilter,
        isDirty,
    };
}

export default function FilterPage() {
    const [regions, setRegions] = useState<RegionLoaderData>({
        provinces: [],
        regencies: [],
        districts: [],
    });

    useEffect(() => {
        let isMounted = true;
        fetch("/data/indonesia_regions.json")
            .then((response) => (response.ok ? response.json() : null))
            .then((data: RegionLoaderData | null) => {
                if (isMounted && data) setRegions(data);
            })
            .catch(() => {
                if (isMounted) setRegions({ provinces: [], regencies: [], districts: [] });
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const { provinces, regencies, districts } = regions;
    const {
        searchParams,
        selectedProvince,
        selectedRegency,
        selectedDistrict,
        availableRegencies,
        availableDistricts,
        updateFilter,
        resetFilter,
        isDirty,
    } = useRegionFilter(provinces, regencies, districts);

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
                        <RegionSelect
                            label="Provinsi"
                            name="province"
                            value={searchParams.get("province") ?? ""}
                            options={provinces}
                            onChange={(v) => updateFilter("province", v)}
                        />
                        <RegionSelect
                            label="Kota/Kabupaten"
                            name="regency"
                            value={searchParams.get("regency") ?? ""}
                            options={availableRegencies}
                            disabled={!selectedProvince}
                            onChange={(v) => updateFilter("regency", v)}
                        />
                        <RegionSelect
                            label="Kecamatan"
                            name="district"
                            value={searchParams.get("district") ?? ""}
                            options={availableDistricts}
                            disabled={!selectedRegency}
                            onChange={(v) => updateFilter("district", v)}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={resetFilter}
                        disabled={!isDirty}
                        className="mt-10 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-500 bg-white px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400"
                    >
                        Reset
                    </button>
                </aside>

                <div className="flex-1 px-6 py-8 md:px-12">
                    <nav className="breadcrumb text-sm text-slate-400">
                        {buildBreadcrumb(selectedProvince?.name, selectedRegency?.name, selectedDistrict?.name)}
                    </nav>

                    <main className="mt-10 flex flex-col items-center gap-10 text-center">
                        <RegionLabel label="Provinsi" value={selectedProvince?.name} size="xl" />
                        <span className="text-slate-300">↓</span>
                        <RegionLabel label="Kota / Kabupaten" value={selectedRegency?.name} />
                        <span className="text-slate-300">↓</span>
                        <RegionLabel label="Kecamatan" value={selectedDistrict?.name} />
                    </main>
                </div>

            </div>
        </div>
    );
}
