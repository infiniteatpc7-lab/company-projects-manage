import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, MapPin, AlignLeft } from 'lucide-react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Country, State, City } from 'country-state-city';

export default function Edit({ client }: any) {
    const { data, setData, put, processing, errors } = useForm({
        company_name: client.company_name || '',
        contact_person: client.contact_person || '',
        email: client.email || '',
        phone: client.phone || '',
        whatsapp: client.whatsapp || '',
        address: client.address || '',
        city: client.city || '',
        state: client.state || '',
        country: client.country || 'India',
        status: client.status || 'Active',
        notes: client.notes || '',
    });

    const submit = (e: any) => {
        e.preventDefault();
        put(route('clients.update', client.id));
    };

    const countries = Country.getAllCountries();
    const selectedCountryObj = countries.find(c => c.name === data.country);
    const states = selectedCountryObj ? State.getStatesOfCountry(selectedCountryObj.isoCode) : [];
    const selectedStateObj = states.find(s => s.name === data.state);
    const cities = selectedCountryObj && selectedStateObj ? City.getCitiesOfState(selectedCountryObj.isoCode, selectedStateObj.isoCode) : [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4 max-w-4xl mx-auto w-full">
                    <Link
                        href={route('clients.index')}
                        className="inline-flex items-center justify-center rounded-md h-9 w-9 border border-input bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-foreground">Edit Client</h2>
                        <p className="text-sm text-foreground/60">{client.company_name}</p>
                    </div>
                </div>
            }
        >
            <Head title={`Edit ${client.company_name}`} />

            <div className="mx-auto max-w-7xl pb-10">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column: Basic Information */}
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden h-full">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Basic Information</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="company_name" value="Company Name *" />
                                        <input
                                            id="company_name"
                                            type="text"
                                            value={data.company_name}
                                            onChange={(e) => setData('company_name', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                        />
                                        <InputError message={errors.company_name} className="mt-1.5" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="contact_person" value="Contact Person *" />
                                        <input
                                            id="contact_person"
                                            type="text"
                                            value={data.contact_person}
                                            onChange={(e) => setData('contact_person', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                        />
                                        <InputError message={errors.contact_person} className="mt-1.5" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="email" value="Email Address *" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                        />
                                        <InputError message={errors.email} className="mt-1.5" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="phone" value="Phone Number *" />
                                        <input
                                            id="phone"
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                        />
                                        <InputError message={errors.phone} className="mt-1.5" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="whatsapp" value="WhatsApp Number" />
                                        <input
                                            id="whatsapp"
                                            type="text"
                                            value={data.whatsapp}
                                            onChange={(e) => setData('whatsapp', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                        />
                                        <InputError message={errors.whatsapp} className="mt-1.5" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="status" value="Status *" />
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-1.5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Address Details */}
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden h-full">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Address Details</h3>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <InputLabel htmlFor="address" value="Street Address" />
                                    <input
                                        id="address"
                                        type="text"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                        placeholder="123 Business Rd, Suite 100"
                                    />
                                    <InputError message={errors.address} className="mt-1.5" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="country" value="Country *" />
                                    <input
                                        id="country"
                                        list="countries-list"
                                        type="text"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                    />
                                    <datalist id="countries-list">
                                        {countries.map((country, index) => (
                                            <option key={index} value={country.name} />
                                        ))}
                                    </datalist>
                                    <InputError message={errors.country} className="mt-1.5" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="state" value="State / Province" />
                                    <input
                                        id="state"
                                        list="states-list"
                                        type="text"
                                        value={data.state}
                                        onChange={(e) => setData('state', e.target.value)}
                                        className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                    />
                                    <datalist id="states-list">
                                        {states.map((state, index) => (
                                            <option key={index} value={state.name} />
                                        ))}
                                    </datalist>
                                    <InputError message={errors.state} className="mt-1.5" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="city" value="City" />
                                    <input
                                        id="city"
                                        list="cities-list"
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                    />
                                    <datalist id="cities-list">
                                        {cities.map((city, index) => (
                                            <option key={index} value={city.name} />
                                        ))}
                                    </datalist>
                                    <InputError message={errors.city} className="mt-1.5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information - Full Width */}
                    <div className="mt-6 rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                        <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                            <AlignLeft className="h-5 w-5 text-muted-foreground" />
                            <h3 className="text-base font-medium text-foreground">Additional Notes</h3>
                        </div>
                        <div className="p-6">
                            <InputLabel htmlFor="notes" value="Notes" />
                            <textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="mt-1.5 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                rows={4}
                            />
                            <InputError message={errors.notes} className="mt-1.5" />
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-6 flex items-center justify-end gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
                        <Link 
                            href={route('clients.index')} 
                            className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Update Client'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
