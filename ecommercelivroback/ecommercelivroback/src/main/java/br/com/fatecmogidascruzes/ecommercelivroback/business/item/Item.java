package br.com.fatecmogidascruzes.ecommercelivroback.business.item;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

import br.com.fatecmogidascruzes.ecommercelivroback.business.item.category.CategoryConverter;
import br.com.fatecmogidascruzes.ecommercelivroback.business.item.pricingGroup.PricingGroupConverter;
import br.com.fatecmogidascruzes.ecommercelivroback.business.item.publisher.PublisherConverter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "items")
public class Item {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "itm_id")
  private Long id;

  @NotBlank(message = "title: Título não pode ser vazio")
  @Column(name = "itm_title", nullable = false)
  private String title;

  @Column(name = "itm_description")
  private String description;

  @NotNull(message = "price: Preço não pode ser vazio")
  @Column(name = "itm_price", nullable = false)
  private Double price;

  @NotBlank(message = "date: Data não pode ser vazia")
  @Column(name = "itm_date", nullable = false)
  private String date;

  @NotBlank(message = "edition: Edição não pode ser vazia")
  @Column(name = "itm_edition", nullable = false)
  private String edition;

  @NotBlank(message = "isbn: ISBN não pode ser vazia")
  @Column(name = "itm_isbn", nullable = false)
  private String isbn;

  @NotNull(message = "pages: Páginas não pode ser vazia")
  @Column(name = "itm_pages", nullable = false)
  private Integer pages;

  @Column(name = "itm_synopsis")
  private String synopsis;

  @NotNull(message = "height: Altura não pode ser vazia")
  @Column(name = "itm_height", nullable = false)
  private Double height;

  @NotNull(message = "width: Largura não pode ser vazia")
  @Column(name = "itm_width", nullable = false)
  private Double width;

  @NotNull(message = "depth: Profundidade não pode ser vazia")
  @Column(name = "itm_depth", nullable = false)
  private Double depth;

  @NotNull(message = "barcode: Codigo de barras não pode ser vazia")
  @Column(name = "itm_barcode", nullable = false)
  private Long barcode;

  @Column(name = "itm_image")
  private String image;

  @NotNull(message = "category: Categorias não pode ser vazia")
  @Convert(converter = CategoryConverter.class)
  @Column(name = "itm_category", nullable = false)
  private List<String> category;

  @NotNull(message = "pricingGroup: Grupo de preços não pode ser vazio")
  @Convert(converter = PricingGroupConverter.class)
  @Column(name = "itm_pricinggroup", nullable = false)
  private String pricingGroup;

  @NotNull(message = "publisher: Editora não pode ser vazia")
  @Convert(converter = PublisherConverter.class)
  @Column(name = "itm_publisher", nullable = false)
  private String publisher;

}
