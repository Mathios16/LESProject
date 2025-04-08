package br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO;

import jakarta.validation.Valid;

import br.com.fatecmogidascruzes.ecommercelivroback.business.item.Item;

import java.util.List;
import java.util.Optional;

import br.com.fatecmogidascruzes.ecommercelivroback.business.item.Inventory;

public record dataItem(@Valid Item item, Optional<List<Inventory>> inventory) {
}
