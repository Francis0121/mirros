package com.bg.jtown.business.seller;

import java.util.List;

import com.bg.jtown.business.Contract;
import com.bg.jtown.business.search.ContractFilter;

/**
 * @author Francis
 * 
 */
public interface ContractService {

	List<Contract> selectContractList(ContractFilter contractFilter);

	Contract selectContract(Integer sellerPn);

	Contract selectContractPeroid(Integer sellerPn);

	void insertCaculatePeroidContract(Contract contract);

	void insertContract(Contract contract);

	void deleteContract(Integer contractPn);

}
