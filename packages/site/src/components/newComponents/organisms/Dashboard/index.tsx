import React, { useEffect } from "react";
import {
  DashboardButtonContainer,
  DashboardCard1,
  DashboardCard2,
  DashboardCard3,
  DashboardCardsContainer,
  DashboardNFTTableRoot,
  DashboardRoot,
  DashboardTokensTableRoot,
} from "./styles";
import { Button } from "../../atoms/Button";
import { Dimensions } from "../../globalStyles";
import { AssetCard, RecentActivityCard, WalletCard } from "../../molecules";
import { TableView } from "../../molecules/TableView";
import useAssetGuards from "../../../../hooks/Assets/useAssetGuards";
import { navigate } from "gatsby";
import { NAVIGATION_PATHS } from "../../../../constants";
import { ActionType, Page } from "../../../../hooks/actions";
import { useData } from "../../../../hooks/DataContext";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { EmptyStateContainer } from "../../../EmptyStateContainer";
import { LoaderModal } from "../../../LoaderModal";

const Dashboard = () => {

  const { state, dispatch } = useData();

  const { assetGuards, setAssetGuards, refetch } = useAssetGuards();
  const { ERC20Assets, ERC721Assets } = assetGuards;

  const launchAddAssetsFlow = () => {
    navigate(NAVIGATION_PATHS.ONBOARDING)
    dispatch({ type: ActionType.SET_SELECTED_TAB, payload: Page.Tokens })
    dispatch({ type: ActionType.SET_ASSET_TO_ADD, payload: true })
  };

  const unprotectedAssets = [...ERC20Assets, ...ERC721Assets].filter((asset) => !asset.isPreGuarded)

  return (
    <DashboardRoot>
      <LoaderModal open={state.loader.open} message={state.loader.message} />
      <DashboardCardsContainer>
        <DashboardCard1>
          <WalletCard />
        </DashboardCard1>
        <DashboardCard2>
          {ERC20Assets && ERC721Assets &&
            <AssetCard
              protectedAssets={{ tokens: ERC20Assets.filter((asset) => asset.isPreGuarded).length, nfts: ERC721Assets.filter((asset) => asset.isPreGuarded).length }}
              protectedValue={1500}
            />}
        </DashboardCard2>
      </DashboardCardsContainer>
      <DashboardButtonContainer>
        {unprotectedAssets.length > 0 &&
          <Button image="/add.svg" text="Add Assets to Protect" width={Dimensions.dashboardButtonWidth} border="rounded" onClick={launchAddAssetsFlow} />
        }
      </DashboardButtonContainer>
      <DashboardTokensTableRoot>
        {ERC20Assets.filter((asset) => asset.isPreGuarded)?.length > 0 ? <TableView
          type="token"
          tableHeader={"Tokens"}
          labels={[
            "Token",
            "Balance",
            "Security",
            "Status",
          ]}
          data={ERC20Assets.filter((asset) => asset.isPreGuarded)}
          setData={setAssetGuards}
          buttonOptions={{ edit: true, delete: true }}
          refetch={refetch}
        />
          :
          <>
            <EmptyStateContainer message="You have no tokens protected yet." button={
              <Button onClick={launchAddAssetsFlow} text="Add NFTs" />
            } />
          </>
        }
      </DashboardTokensTableRoot>
      <DashboardNFTTableRoot>
        {ERC721Assets.filter((asset) => asset.isPreGuarded)?.length > 0 ? <TableView
          type="nft"
          tableHeader={"NFTs"}
          labels={["NFT", "Collection", "Security", "Status"]}
          data={ERC721Assets.filter((asset) => asset.isPreGuarded)}
          setData={setAssetGuards}
          buttonOptions={{ edit: true, delete: true }}
          refetch={refetch}
        />
          :
          <>
            <EmptyStateContainer message="You have no NFTs protected yet." button={
              <Button onClick={launchAddAssetsFlow} text="Add NFTs" />
            } />
          </>}
      </DashboardNFTTableRoot>
    </DashboardRoot>
  );
};

export default Dashboard;
