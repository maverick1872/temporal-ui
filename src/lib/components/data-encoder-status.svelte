<script lang="ts">
  import IconButton from '$lib/holocene/icon-button.svelte';
  import ToggleSwitch from '$lib/holocene/toggle-switch.svelte';
  import Tooltip from '$lib/holocene/tooltip.svelte';
  import { translate } from '$lib/i18n/translate';
  import { dataEncoder } from '$lib/stores/data-encoder';
  import { codecEnabled } from '$lib/stores/data-encoder-config';

  import { viewDataEncoderSettings } from './data-encoder-settings.svelte';

  const onIconClick = () => {
    $viewDataEncoderSettings = !$viewDataEncoderSettings;
    if ($viewDataEncoderSettings) {
      document.getElementById('content-wrapper')?.scrollTo(0, 0);
    }
  };

  const variant = $derived<'primary' | 'ghost'>(
    $viewDataEncoderSettings ? 'primary' : 'ghost',
  );
</script>

<div class="mx-1 flex items-center gap-2">
  <Tooltip
    bottomRight
    text={translate('data-encoder.codec-server-enabled-label')}
  >
    <ToggleSwitch
      id="codec-server-enabled"
      label={translate('data-encoder.codec-server-enabled-label')}
      labelHidden
      bind:checked={$codecEnabled}
      data-testid="data-encoder-enabled-toggle"
    />
  </Tooltip>
  {#if $dataEncoder?.endpoint}
    {#if $dataEncoder?.hasNotRequested}
      <Tooltip
        bottomRight
        text={translate('data-encoder.codec-server-configured')}
      >
        <IconButton
          {variant}
          label={translate('data-encoder.codec-server-configured')}
          class="relative flex items-center"
          data-testid="data-encoder-status-configured"
          icon="transcoder-on"
          on:click={onIconClick}
        />
      </Tooltip>
    {:else if $dataEncoder.hasError}
      <Tooltip bottomRight text={translate('data-encoder.codec-server-error')}>
        <IconButton
          {variant}
          label={translate('data-encoder.codec-server-error')}
          class="relative flex items-center"
          data-testid="data-encoder-status-error"
          icon="transcoder-error"
          on:click={onIconClick}
        />
      </Tooltip>
    {:else if $dataEncoder.hasSuccess}
      <Tooltip
        bottomRight
        text={translate('data-encoder.codec-server-success')}
      >
        <IconButton
          {variant}
          label={translate('data-encoder.codec-server-success')}
          class="relative flex items-center"
          data-testid="data-encoder-status-success"
          icon="transcoder-on"
          on:click={onIconClick}
        />
      </Tooltip>
    {/if}
  {:else}
    <Tooltip
      bottomRight
      text={translate('data-encoder.configure-codec-server')}
    >
      <IconButton
        {variant}
        label={translate('data-encoder.configure-codec-server')}
        class="relative flex items-center"
        data-testid="data-encoder-status"
        icon="transcoder-off"
        on:click={onIconClick}
      />
    </Tooltip>
  {/if}
</div>
