package br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cupom.Cupom;

@Repository
public interface CupomRepository extends JpaRepository<Cupom, Long> {
  Optional<Cupom> findByCode(String code);
}
