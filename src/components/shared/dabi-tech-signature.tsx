import { DaBiTechLogo } from "@/components/shared/dabi-tech-logo";

export const DABI_TECH_CONTACT_URL = "https://wa.me/5541920038570";

type DaBiTechSignatureProps = {
  containerClassName?: string;
  labelClassName?: string;
  logoClassName?: string;
  linkClassName?: string;
};

export function DaBiTechSignature({
  containerClassName,
  labelClassName,
  logoClassName,
  linkClassName,
}: DaBiTechSignatureProps) {
  return (
    <div className={containerClassName}>
      <p className={labelClassName}>Criado por DaBi Tech - Digital Solutions - Todos os direitos reservados</p>
      <a
        className={linkClassName}
        href={DABI_TECH_CONTACT_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir contato da DaBi Tech em nova aba"
      >
        <DaBiTechLogo className={logoClassName} />
      </a>
    </div>
  );
}
