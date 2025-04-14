package br.com.fatecmogidascruzes.ecommercelivroback.infra.web.controller;

import org.springframework.web.bind.annotation.RestController;

import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.InventoryRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.ItemRepository;
import jakarta.validation.Valid;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Objects;

import br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO.dataItem;
import br.com.fatecmogidascruzes.ecommercelivroback.business.item.Inventory;
import br.com.fatecmogidascruzes.ecommercelivroback.business.item.Item;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/items")
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @PostMapping
    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> createItem(@Valid @RequestBody dataItem data) throws Exception {
        Item savedItem = itemRepository.save(data.item());

        if (data.inventory().isPresent()) {
            List<Inventory> inventories = data.inventory().get();

            inventories.forEach(inventory -> inventory.setItemId(savedItem.getId()));
            inventoryRepository.saveAll(inventories);

            savedItem.setInventory(inventories);

            savedItem.validateStatus();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(savedItem);
    }

    @GetMapping
    public ResponseEntity<List<Item>> getAllItems(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String isbn,
            @RequestParam(required = false) Timestamp dateAfter,
            @RequestParam(required = false) Timestamp dateBefore,
            @RequestParam(required = false) Double priceMin,
            @RequestParam(required = false) Double priceMax,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String publisher) {
        List<Item> items = itemRepository.findAll();

        if (title != null && !title.isEmpty()) {
            items = items.stream()
                    .filter(item -> item.getTitle().toLowerCase().contains(title.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (isbn != null && !isbn.isEmpty()) {
            items = items.stream()
                    .filter(item -> item.getIsbn().toLowerCase().contains(isbn.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (dateAfter != null) {
            items = items.stream()
                    .filter(item -> item.getDate().after(dateAfter))
                    .collect(Collectors.toList());
        }

        if (dateBefore != null) {
            items = items.stream()
                    .filter(item -> item.getDate().before(dateBefore))
                    .collect(Collectors.toList());
        }

        if (priceMin != null) {
            items = items.stream()
                    .filter(item -> item.getPrice() >= priceMin)
                    .collect(Collectors.toList());
        }

        if (priceMax != null) {
            items = items.stream()
                    .filter(item -> item.getPrice() <= priceMax)
                    .collect(Collectors.toList());
        }

        if (category != null) {
            if (category.contains(",")) {
                String[] categories = category.split(",");

                for (String catitem : categories) {
                    items = items.stream()
                            .filter(item -> item.getCategory().stream()
                                    .anyMatch(cat -> cat.toLowerCase().contains(catitem.toLowerCase())))
                            .collect(Collectors.toList());
                }
            } else {
                items = items.stream()
                        .filter(item -> item.getCategory().stream()
                                .anyMatch(cat -> cat.contains(category)))
                        .collect(Collectors.toList());
            }
        }

        if (publisher != null && !publisher.isEmpty()) {
            items = items.stream()
                    .filter(item -> item.getPublisher().toLowerCase().contains(publisher.toLowerCase()))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        Optional<Item> item = itemRepository.findById(id);
        return item.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> updateItem(@PathVariable Long id, @Valid @RequestBody dataItem data) throws Exception {
        Optional<Item> existingItem = itemRepository.findById(id);
        if (existingItem.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        BeanUtils.copyProperties(data.item(), existingItem, "id", "inventory");

        List<Inventory> inventoriesToRemove = existingItem.get().getInventory().stream()
                .filter(existingInventory -> data.inventory().get().stream()
                        .noneMatch(newInventory -> Objects.equals(existingInventory.getId(), newInventory.getId())))
                .collect(Collectors.toList());

        inventoryRepository.deleteAll(inventoriesToRemove);
        existingItem.get().getInventory().removeAll(inventoriesToRemove);

        if (data.inventory().isPresent()) {
            List<Inventory> inventories = data.inventory().get();

            existingItem.get().setInventory(inventories);

            existingItem.get().validateStatus();

            inventories.forEach(inventory -> inventory.setItemId(existingItem.get().getId()));
            inventoryRepository.saveAll(inventories);
        }

        Item updatedItem = itemRepository.save(existingItem.get());

        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        Optional<Item> item = itemRepository.findById(id);
        if (item.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        itemRepository.delete(item.get());
        return ResponseEntity.ok().build();
    }
}
