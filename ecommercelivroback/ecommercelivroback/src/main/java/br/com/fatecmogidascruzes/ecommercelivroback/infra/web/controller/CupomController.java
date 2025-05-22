package br.com.fatecmogidascruzes.ecommercelivroback.infra.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cupom.Cupom;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CupomRepository;

import java.sql.Timestamp;
import java.util.Optional;

@RestController
@RequestMapping("/cupom")
public class CupomController {
  @Autowired
  private CupomRepository cupomRepository;

  @PostMapping
  public ResponseEntity<Cupom> createCupom(@RequestBody Cupom cupom) {
    Cupom savedCupom = cupomRepository.save(cupom);
    return ResponseEntity.ok(savedCupom);
  }

  @GetMapping("/{search}/{column}")
  public ResponseEntity<?> getCupomByCode(@PathVariable String search, @PathVariable String column) {
    Optional<Cupom> cupom = Optional.empty();
    if (column.equals("code")) {
      cupom = cupomRepository.findByCode(search);
    } else if (column.equals("id")) {
      cupom = cupomRepository.findById(Long.parseLong(search));
    }

    if (cupom.isEmpty()) {
      return ResponseEntity.ok("");
    }

    if (cupom.get().getExpirationDate().before(new Timestamp(System.currentTimeMillis())) ||
        cupom.get().getOrderId() != null) {
      return ResponseEntity.ok("");
    }

    return ResponseEntity.ok(cupom.get());
  }
}