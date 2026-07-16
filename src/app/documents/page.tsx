"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const services = [
  {
    title: "Persönliche Unterlagen",
    description: (
      <div className="space-y-4 text-sm text-zinc-700">
        <p className="font-medium text-zinc-500">An die Antragsteller</p>
        <h3 className="text-lg font-bold text-[#18181b]">
          Notwendige Bonitätsunterlagen
        </h3>
        <p>Sehr geehrte Damen und Herren,</p>
        <p>
          folgende Unterlagen werden dringend für den Finanzierungsantrag
          benötigt:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Ihre 3 letzten Gehaltsnachweise ( falls verheiratet: von beiden
            Interessenten )
          </li>
          <li>
            Dezember-Abrechnung des Vorjahres ( falls verheiratet: von beiden
            Interessenten )
          </li>
          <li>Ausweiskopien beidseitig von allen Interessenten</li>
          <li>
            Eigenkapitalnachweis ( Kontoauszug, Kopie des Sparbuches,
            Jahreskontoauszüge bei Bausparverträgen oder Wertpapieren, etc. )
          </li>
          <li>
            falls Privatkredite bestehen: Kopie der entsprechenden
            Kreditverträge
          </li>
          <li>bei Unterhalt: Unterhaltsnachweise</li>
          <li>
            Ihre letztergangenen Renteninformationen Ihrer gesetzlichen
            Rentenversicherung
          </li>
          <li>
            bei Beschäftigungsdauer weniger als ein Jahr: Ihr Arbeitsvertrag
          </li>
        </ul>
        <p>
          Die vorbezeichneten Unterlagen bitte ich an mich per E-Mail oder auf
          dem Postwege zu übersenden.
        </p>
        <p>
          Mit freundlichen Grüßen
          <br />
          <span className="font-semibold text-[#18181b]">
            Ihr Sidhu-Finanzen-Team
          </span>
        </p>
      </div>
    ),
    pdf: "/documents/document-1.pdf",
  },
  {
    title: "Kauf eines Objektes",
    description: (
      <div className="space-y-4 text-sm text-zinc-700">
        <p className="font-medium text-zinc-500">
          An den Makler
          <br />
          oder Hauseigentümer
        </p>
        <h3 className="text-lg font-bold text-[#18181b]">
          Notwendige Objektunterlagen
        </h3>
        <p>Sehr geehrte Damen und Herren,</p>
        <p>
          folgende Unterlagen werden dringend für den Finanzierungsantrag
          benötigt:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Wohnflächenberechnung</li>
          <li>gültiger Energieausweis</li>
          <li>Bauzeichnungen ( Schnitt, Grundrisse bemaßt und Ansichten )</li>
          <li>Baubeschreibung (falls vorhanden)</li>
          <li>Flurkarte oder Lageplan</li>
          <li>
            vollständiger Grundbuchauszug ( nicht älter als 3 Monate ) oder
            notarieller Kaufvertragsentwurf
          </li>
          <li>
            Objektfotos ( Vorder- und Rückansicht, ein Foto vom Bad, vom
            Wohnzimmer, von der Küche und von der Heizungsanlage )
          </li>
        </ul>
        <p>
          Die vorbezeichneten Unterlagen bitte ich an mich per E-Mail oder auf
          dem Postwege zu übersenden.
        </p>
        <p>
          Mit freundlichen Grüßen
          <br />
          <span className="font-semibold text-[#18181b]">
            Ihr Sidhu-Finanzen-Team
          </span>
        </p>
      </div>
    ),
    pdf: "/documents/document-2.pdf",
  },
  {
    title: "Neubau",
    description: (
      <div className="space-y-4 text-sm text-zinc-700">
        <p className="font-medium text-zinc-500">
          An den Grundstücksverkäufer,
          <br />
          Architekt oder Bauträger
        </p>
        <h3 className="text-lg font-bold text-[#18181b]">
          Notwendige Objektunterlagen für die finanzierende Bank
        </h3>
        <p>Sehr geehrte Damen und Herren,</p>
        <p>
          folgende Unterlagen werden dringend für den Finanzierungsantrag
          benötigt:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Lageplan oder Flurkarte</li>
          <li>
            notarieller Kaufvertragsentwurf für das Baugrundstück oder einen
            aktuellen Grundbuchauszug ( nicht älter als 3 Monate )
          </li>
          <li>Wohnflächenberechnung</li>
          <li>Berechnung des umbauten Raumes</li>
          <li>Bauzeichnungen ( Schnitt, Grundrisse bemaßt und Ansichten )</li>
          <li>Baubeschreibung</li>
          <li>
            Kostenaufstellung für die Baukosten oder einen
            Bauwerkvertragsentwurf nebst Zahlungsplan
          </li>
          <li>
            falls KfW-Standard „Energieeffizient Bauen&rdquo; beantragt wird:
            Online-Bestätigung hierzu
          </li>
        </ul>
        <p>
          Die vorbezeichneten Unterlagen bitte ich an mich per E-Mail oder auf
          dem Postwege zu übersenden.
        </p>
        <p>
          Mit freundlichen Grüßen
          <br />
          <span className="font-semibold text-[#18181b]">
            Ihr Sidhu-Finanzen-Team
          </span>
        </p>
      </div>
    ),
    pdf: "/documents/document-3.pdf",
  },
  {
    title: "Wohnungskauf",
    description: (
      <div className="space-y-4 text-sm text-zinc-700">
        <p className="font-medium text-zinc-500">
          An den Wohnungseigentümer oder an den
          <br />
          zuständigen Makler
        </p>
        <h3 className="text-lg font-bold text-[#18181b]">
          Notwendige Objektunterlagen für die finanzierende Bank
        </h3>
        <p>Sehr geehrte Damen und Herren,</p>
        <p>
          folgende Unterlagen werden dringend für den Finanzierungsantrag
          benötigt:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Teilungserklärung</li>
          <li>Grundriss der Wohnung mit Maßangaben</li>
          <li>Wohnflächenberechnung detailliert</li>
          <li>
            Grundbuchauszug ( nicht älter als 3 Monate ) oder notarieller
            Kaufvertragsentwurf
          </li>
          <li>Fotos: Außen, vom Bad und von den Fenstern</li>
          <li>Flurkarte</li>
        </ul>
        <p>
          Die vorbezeichneten Unterlagen bitte ich an mich per E-Mail oder auf
          dem Postwege zu übersenden.
        </p>
        <p>
          Mit freundlichen Grüßen
          <br />
          <span className="font-semibold text-[#18181b]">
            Ihr Sidhu-Finanzen-Team
          </span>
        </p>
      </div>
    ),
    pdf: "/documents/document-4.pdf",
  },
  {
    title: "Umschuldung eines bestehenden Darlehens",
    description: (
      <div className="space-y-4 text-sm text-zinc-700">
        <p className="font-medium text-zinc-500">An die Antragsteller</p>
        <h3 className="text-lg font-bold text-[#18181b]">
          Notwendige Objektunterlagen zur Umschuldung
        </h3>
        <p>Sehr geehrte Damen und Herren,</p>
        <p>
          folgende Unterlagen werden dringend für den Finanzierungsantrag
          benötigt:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Kopie des Kreditvertrages der abzulösenden Bank</li>
          <li>
            Kopie der letzten 2 Jahreskontoauszüge des abzulösenden Darlehens
          </li>
          <li>Berechnung der Wohnfläche in m² gemäß Wohnflächenverordnung</li>
          <li>bemaßte Grundriss- und Schnittzeichnungen</li>
          <li>Objektfotos von Innen und Außen</li>
          <li>Teilungserklärung oder Aufteilungsplan bei Eigentumswohnungen</li>
          <li>
            Kopie des vollständigen, unbeglaubigten Grundbuchauszuges ( nicht
            älter als 3 Monate )
          </li>
          <li>Flurkarte</li>
          <li>
            ursprünglicher Kaufvertrag bzw. ursprüngliche Aufteilung der
            Gesamtherstellungskosten
          </li>
        </ul>
        <p>
          Die vorbezeichneten Unterlagen bitte ich an mich per E-Mail oder auf
          dem Postwege zu übersenden.
        </p>
        <p>
          Mit freundlichen Grüßen
          <br />
          <span className="font-semibold text-[#18181b]">
            Ihr Sidhu-Finanzen-Team
          </span>
        </p>
      </div>
    ),
    pdf: "/documents/document-5.pdf",
  },
  {
    title: "Privatkredit",
    description: (
      <div className="space-y-4 text-sm text-zinc-700">
        <p className="font-medium text-zinc-500">An die Antragsteller</p>
        <h3 className="text-lg font-bold text-[#18181b]">
          Notwendige Unterlagen zum Privatkredit
        </h3>
        <p>Sehr geehrte Damen und Herren,</p>
        <p>
          folgende Unterlagen werden dringend für den Finanzierungsantrag
          benötigt:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Personalausweise ( falls verheiratet von beiden )</li>
          <li>
            die letzten 3 Gehaltsnachweise ( falls verheiratet von beiden )
          </li>
          <li>
            Kontoauszüge der letzten 8 Wochen lückenlos, falls mehrere
            Girokonten bestehen, gilt dies für alle bestehenden Konten
          </li>
          <li>
            alle Privatkreditverträge in Kopie ( gilt auch für Rahmenkredite und
            Kreditkarten )
          </li>
          <li>
            falls das Arbeitsverhältnis erst seit weniger als 1 Jahr besteht:
            den Arbeitsvertrag
          </li>
          <li>
            falls Immobiliendarlehen bestehen: entsprechende Darlehensverträge
          </li>
        </ul>
        <p>
          Die vorbezeichneten Unterlagen bitte ich an mich per E-Mail oder auf
          dem Postwege zu übersenden.
        </p>
        <p>
          Mit freundlichen Grüßen
          <br />
          <span className="font-semibold text-[#18181b]">
            Ihr Sidhu-Finanzen-Team
          </span>
        </p>
      </div>
    ),
    pdf: "/documents/document-6.pdf",
  },
];

export default function FinanceServices() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section
      className="relative min-h-[700px] bg-cover bg-center py-20"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-white/85" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-light tracking-wide text-gray-900">
            Unsere Dienstleistungen
          </h1>
          <p className="mt-4 text-gray-600">
            Finden Sie passende Lösungen für Ihre Finanzierung
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const isOpen = active === service.title;

            return (
              <div
                key={service.title}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Dropdown Header */}
                <button
                  onClick={() => setActive(isOpen ? null : service.title)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left"
                >
                  <h2 className="text-lg font-medium text-gray-900">
                    {service.title}
                  </h2>

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-gray-700 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Body */}
                <div
                  className={`grid transition-all duration-500 ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6">
                      <div className="mb-5 leading-6">
                        {service.description}
                      </div>

                      {/* PDF Button */}
                      <a
                        href={service.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-lg bg-green-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-600"
                      >
                        PDF öffnen
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
