package br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence;

import br.com.fatecmogidascruzes.ecommercelivroback.business.address.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByCustomer(Long customer);
}
